import { conn } from '@/libs/mysql';
import { NextResponse } from 'next/server';

/**
 * Body esperado:
 * {
 *   "email": "operador@correo.com",         // email del operador (operators.email_address)
 *   "subscriber_id": 123,                   // id del usuario suscriptor
 *   "subscribed_to": 5                      // id del evento
 * }
 */
export async function POST(req) {
  try {
    const { email, subscriber_id, subscribed_to } = await req.json();

    if (!email || !subscriber_id || !subscribed_to) {
      return NextResponse.json({ message: 'Petición inválida' }, { status: 400 });
    }

    const query = `
      SELECT s.*
      FROM subscriptions s
      JOIN events e ON s.subscribed_to = e.id
      JOIN operators o ON e.id = o.event_id
      WHERE s.subscriber_id = ?
        AND s.subscribed_to = ?
        AND o.email_address = ?
      LIMIT 1;
    `;

    const rows = await conn.query(query, [subscriber_id, subscribed_to, email]);

    if (Array.isArray(rows) && rows.length > 0) {
      return NextResponse.json(
        { message: 'Suscripción encontrada', data: rows[0] },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: 'Suscripción no encontrada' },
      { status: 404 }
    );
  } catch (error) {
    console.error('checkSubscription error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
