import { conn } from '@/libs/mysql';
import { NextResponse } from 'next/server';

/**
 * Body esperado (POST):
 * {
 *   "operator_email": "operador@correo.com",
 *   "event_id": 5            // opcional: si lo mandas, filtra por ese evento
 * }
 *
 * Respuesta: lista de suscripciones + info básica del usuario y evento.
 */
export async function POST(req) {
  try {
    const { operator_email, event_id } = await req.json();

    if (!operator_email) {
      return NextResponse.json({ message: 'Petición inválida' }, { status: 400 });
    }

    const base = `
      SELECT 
        s.id                AS subscription_id,
        s.subscriber_id,
        s.subscribed_to     AS event_id,
        s.created_at,
        s.expires_at,
        u.email_address     AS user_email,
        u.first_name,
        u.last_name,
        e.title             AS event_title,
        e.start,
        e.end,
        e.startTime,
        e.endTime,
        e.location
      FROM subscriptions s
      JOIN events e       ON e.id = s.subscribed_to
      JOIN operators o    ON o.event_id = e.id
      JOIN users u        ON u.id = s.subscriber_id
      WHERE o.email_address = ?
    `;

    const params = [operator_email];
    let query = base;

    if (event_id) {
      query += ` AND e.id = ?`;
      params.push(event_id);
    }

    query += ` ORDER BY s.created_at DESC, s.id DESC`;

    const rows = await conn.query(query, params);

    return NextResponse.json(Array.isArray(rows) ? rows : [], { status: 200 });
  } catch (error) {
    console.error('getSubscriptions error:', error);
    return NextResponse.json({ message: 'Error al obtener suscripciones' }, { status: 500 });
  }
}
