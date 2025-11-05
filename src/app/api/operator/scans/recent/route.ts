// src/app/api/operators/scans/recent/route.ts
import { NextResponse } from 'next/server';
import { conn } from '@/libs/mysql';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const SEC = process.env.JWT_SECRET!;

async function getEmail() {
  try {
    const token = cookies().get('ScannToken')?.value;
    if (!token || !SEC) return null;
    const { payload } = await jwtVerify(token, new TextEncoder().encode(SEC));
    const me: any = payload?.user;
    return me?.email_address || null;
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  try {
    const email = await getEmail();
    if (!email) return NextResponse.json({ message: 'Auth requerida' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('eventId');

    const rows = await conn.query(
      `
      SELECT os.id, os.scanned_at, os.result,
             os.event_id, os.subscription_id, os.subscriber_id,
             u.email_address AS subscriber_email
      FROM operator_scans os
      LEFT JOIN subscriptions s ON s.id = os.subscription_id
      LEFT JOIN users u ON u.id = s.subscriber_id
      WHERE os.operator_email = ?
        ${eventId ? 'AND os.event_id = ?' : ''}
      ORDER BY os.scanned_at DESC
      LIMIT 50
      `,
      eventId ? [email, Number(eventId)] : [email],
    );

    return NextResponse.json({ rows: Array.isArray(rows) ? rows : [] }, { status: 200 });
  } catch (e) {
    console.error('recent scans error:', e);
    return NextResponse.json({ message: 'Error listando escaneos' }, { status: 500 });
  }
}
