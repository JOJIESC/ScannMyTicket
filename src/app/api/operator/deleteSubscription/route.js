import { conn } from '@/libs/mysql';
import { NextResponse } from 'next/server';

/**
 * Body esperado:
 * {
 *   "id": 77,                    // id de la suscripción a borrar
 *   "operator_email": "..."      // (opcional, recomendado) email del operador que ejecuta la acción
 * }
 *
 * Nota: si quieres restringir que sólo operadores ligados al evento borren,
 * descomenta el chequeo de ownership más abajo.
 */
export async function POST(req) {
  try {
    const { id /*, operator_email*/ } = await req.json();

    if (!id) {
      return NextResponse.json({ message: 'Petición inválida' }, { status: 400 });
    }

    // (Opcional) Verificar que el operador pertenece al evento de esa suscripción
    // if (operator_email) {
    //   const rows = await conn.query(
    //     `SELECT s.id
    //        FROM subscriptions s
    //        JOIN events e ON e.id = s.subscribed_to
    //        JOIN operators o ON o.event_id = e.id
    //       WHERE s.id = ? AND o.email_address = ?
    //       LIMIT 1`,
    //     [id, operator_email]
    //   );
    //   if (!Array.isArray(rows) || rows.length === 0) {
    //     return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    //   }
    // }

    const result = await conn.query(`DELETE FROM subscriptions WHERE id = ?`, [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: 'Suscripción no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Suscripción eliminada' }, { status: 200 });
  } catch (error) {
    console.error('deleteSubscription error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
