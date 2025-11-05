import { conn } from '@/libs/mysql';
import { NextResponse } from 'next/server';

/**
 * Body esperado:
 * {
 *   "operator_email": "operador@correo.com"
 * }
 *
 * Devuelve los eventos asociados a ese operador.
 */
export async function POST(req) {
  try {
    const { operator_email } = await req.json();

    if (!operator_email) {
      return NextResponse.json({ message: 'Petición inválida' }, { status: 400 });
    }

    const query = `
      SELECT e.*
      FROM events e
      JOIN operators o ON e.id = o.event_id
      WHERE o.email_address = ?
      ORDER BY e.start DESC, e.id DESC
    `;

    const rows = await conn.query(query, [operator_email]);

    return NextResponse.json(Array.isArray(rows) ? rows : [], { status: 200 });
  } catch (error) {
    console.error('getOperatorEvents error:', error);
    // No uses NextResponse.error con body; usa NextResponse.json
    return NextResponse.json({ message: 'Error al obtener eventos' }, { status: 500 });
  }
}
