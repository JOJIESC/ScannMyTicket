// src/app/api/operator/scan/route.ts
import { NextResponse } from 'next/server';
import { conn } from '@/libs/mysql';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const SEC = process.env.JWT_SECRET!;

function bad(status: number, message: string, extra: any = {}) {
  return NextResponse.json({ message, ...extra }, { status });
}

async function getOperatorFromCookie() {
  try {
    const token = cookies().get('ScannToken')?.value;
    if (!token || !SEC) return null;
    const { payload } = await jwtVerify(token, new TextEncoder().encode(SEC));
    const me: any = payload?.user;
    if (!me?.email_address) return null;
    return { email: me.email_address, role: (me.role || '').toUpperCase() };
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const me = await getOperatorFromCookie();
    if (!me) return bad(401, 'Auth requerida');

    const body = await req.json();
    const event_id = Number(body?.event_id);
    const operator_email = String(body?.operator_email || me.email);
    const qr_raw: string | null = body?.qr_raw ?? null;
    const qr_data: any = body?.qr_data ?? null;

    if (!event_id || !operator_email) return bad(400, 'Faltan event_id u operator_email');

    // 1) Validar que el operador pertenece a este evento
    const ops = await conn.query(
      'SELECT id FROM operators WHERE email_address = ? AND event_id = ?',
      [operator_email, event_id],
    );
    if (!Array.isArray(ops) || ops.length === 0) {
      return bad(403, 'El operador no pertenece a este evento');
    }

    // 2) Parsear QR
    let parsed: any = null;
    if (qr_data && typeof qr_data === 'object') parsed = qr_data;
    else if (typeof qr_raw === 'string') {
      try {
        parsed = JSON.parse(qr_raw);
      } catch {
        return bad(400, 'QR inválido: no es JSON');
      }
    } else {
      return bad(400, 'Falta qr_raw (string) o qr_data (objeto)');
    }

    // soportar ambos formatos del QR (id o subscriber_id + subscribed_to) :contentReference[oaicite:1]{index=1}
    const subscriptionId = parsed.id ? Number(parsed.id) : null;
    const subscriberId = parsed.subscriber_id ? Number(parsed.subscriber_id) : null;
    const subscribedTo = parsed.subscribed_to ? Number(parsed.subscribed_to) : null;

    if (!subscriptionId && !(subscriberId && subscribedTo)) {
      return bad(400, "El QR no contiene 'id' o ('subscriber_id' y 'subscribed_to').");
    }

    // 3) Buscar suscripción
    let subRows: any[] = [];
    if (subscriptionId) {
      subRows = await conn.query('SELECT * FROM subscriptions WHERE id = ?', [subscriptionId]);
    } else {
      subRows = await conn.query(
        'SELECT * FROM subscriptions WHERE subscriber_id = ? AND subscribed_to = ?',
        [subscriberId, subscribedTo],
      );
    }
    if (!Array.isArray(subRows) || subRows.length === 0) return bad(404, 'Suscripción no encontrada');

    const sub = subRows[0];

    // 4) Validar que corresponda al evento
    if (Number(sub.subscribed_to) !== Number(event_id)) {
      return bad(400, 'El ticket no corresponde a este evento');
    }

    // 5) Validar caducidad (si existiera expires_at)
    if (sub.expires_at) {
      const exp = new Date(sub.expires_at);
      if (!isNaN(exp.valueOf()) && exp.getTime() < Date.now()) {
        // registramos intento inválido
        await conn.query(
          `INSERT INTO operator_scans (operator_email, event_id, subscriber_id, subscription_id, scanned_at, result)
           VALUES (?, ?, ?, ?, NOW(), 'invalid')`,
          [operator_email, event_id, sub.subscriber_id, sub.id],
        );
        return bad(410, 'La suscripción ha caducado');
      }
    }

    // 6) Si ya fue usado → repeated
    if (sub.used_at) {
      await conn.query(
        `INSERT INTO operator_scans (operator_email, event_id, subscriber_id, subscription_id, scanned_at, result)
         VALUES (?, ?, ?, ?, NOW(), 'repeated')`,
        [operator_email, event_id, sub.subscriber_id, sub.id],
      );
      return bad(409, 'Este ticket ya fue utilizado', { used_at: sub.used_at });
    }

    // 7) Marcar como usado y registrar historial (success) :contentReference[oaicite:2]{index=2}
    await conn.query('UPDATE subscriptions SET used_at = NOW(), used_by_operator_email = ? WHERE id = ?', [
      operator_email,
      sub.id,
    ]);
    await conn.query(
      `INSERT INTO operator_scans (operator_email, event_id, subscriber_id, subscription_id, scanned_at, result)
       VALUES (?, ?, ?, ?, NOW(), 'success')`,
      [operator_email, event_id, sub.subscriber_id, sub.id],
    );

    return NextResponse.json(
      { status: 'valid', subscription_id: sub.id, used_at: new Date().toISOString() },
      { status: 200 },
    );
  } catch (e) {
    console.error('operator/scan error:', e);
    return NextResponse.json({ message: 'Error interno' }, { status: 500 });
  }
}
