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

  // primero pruebo con jose (tokens nuevos)
  if (joseKey) {
    try {
      const { payload } = await jwtVerify(token, joseKey);
      return payload as any;
    } catch {
      // fall back a jsonwebtoken (tokens antiguos con 'secretkey')
    }
  }

  try {
    const decoded: any = jwt.verify(token, 'secretkey');
    return decoded;
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const p = await getPrincipal();
    if (!p) return NextResponse.json({ message: 'No autorizado' }, { status: 401 });

    // tomamos el email del operador (payload distinto según login)
    const operatorEmail =
      (p as any)?.user?.email_address || (p as any)?.email || null;

    if (!operatorEmail || ((p as any).role ?? (p as any)?.user?.role) !== 'operator') {
      return NextResponse.json({ message: 'No es operador' }, { status: 403 });
    }

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
      WHERE sl.operator_email = ?
      ORDER BY sl.scanned_at DESC
      LIMIT 50
    `;
    const rows = await conn.query(sql, [operatorEmail]);
    // serverless-mysql devuelve [rows, fields] o solo rows; normalizamos:
    const data = Array.isArray(rows) ? (Array.isArray(rows[0]) ? rows[0] : rows) : rows;

    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    console.error('operator/scans error:', e);
    return NextResponse.json({ message: 'Error interno' }, { status: 500 });
  }
}
