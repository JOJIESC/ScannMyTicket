import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { conn } from '@/libs/mysql';
import { jwtVerify } from 'jose';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const joseKey = JWT_SECRET ? new TextEncoder().encode(JWT_SECRET) : null;

async function getPrincipal() {
  const token = cookies().get('ScannToken')?.value;
  if (!token) return null;

  if (joseKey) {
    try {
      const { payload } = await jwtVerify(token, joseKey);
      return payload as any;
    } catch {}
  }
  try {
    return jwt.verify(token, 'secretkey') as any;
  } catch {
    return null;
  }
}

export async function GET(_: Request, { params }: { params: { eventId: string } }) {
  try {
    const p = await getPrincipal();
    if (!p) return NextResponse.json({ message: 'No autorizado' }, { status: 401 });

    const operatorEmail =
      (p as any)?.user?.email_address || (p as any)?.email || null;

    if (!operatorEmail || ((p as any).role ?? (p as any)?.user?.role) !== 'operator') {
      return NextResponse.json({ message: 'No es operador' }, { status: 403 });
    }

    const eventId = Number(params.eventId);
    if (!eventId) return NextResponse.json([], { status: 200 });

    const sql = `
      SELECT
        sl.id,
        sl.event_id,
        e.title AS event_title,
        sl.subscriber_email,
        sl.scanned_at,
        sl.result,
        sl.details
      FROM scan_logs sl
      JOIN events e ON e.id = sl.event_id
      WHERE sl.operator_email = ? AND sl.event_id = ?
      ORDER BY sl.scanned_at DESC
      LIMIT 50
    `;
    const rows = await conn.query(sql, [operatorEmail, eventId]);
    const data = Array.isArray(rows) ? (Array.isArray(rows[0]) ? rows[0] : rows) : rows;

    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    console.error('operator/scans/by-event error:', e);
    return NextResponse.json({ message: 'Error interno' }, { status: 500 });
  }
}
