import { NextResponse } from 'next/server';
import { conn } from '@/libs/mysql';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export async function GET() {
  try {
    const token = cookies().get('ScannToken')?.value;
    const secret = process.env.JWT_SECRET!;
    if (!token || !secret) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    const organizerId = Number((payload as any)?.user?.id);
    if (!organizerId) return NextResponse.json([], { status: 200 });

    const [rows]: any = await conn.query(
      `
      SELECT 
        e.id AS event_id,
        e.title AS event_title,
        e.start,
        e.\`end\`,
        e.location,
        u.id AS user_id,
        CONCAT(COALESCE(u.first_name,''),' ',COALESCE(u.last_name,'')) AS subscriber_name,
        u.email_address AS subscriber_email
      FROM events e
      LEFT JOIN subscriptions s ON s.subscribed_to = e.id
      LEFT JOIN users u         ON u.id = s.subscriber_id
      WHERE e.user_id = ?
      ORDER BY e.start DESC, subscriber_name ASC
      `,
      [organizerId]
    );

    const grouped: Record<number, any> = {};
    for (const r of rows) {
      if (!grouped[r.event_id]) {
        grouped[r.event_id] = {
          event_id: r.event_id,
          title: r.event_title,
          start: r.start,
          end: r.end,
          location: r.location,
          subscribers: [],
        };
      }
      if (r.user_id) {
        grouped[r.event_id].subscribers.push({
          id: r.user_id,
          name: (r.subscriber_name || '').trim(),
          email: r.subscriber_email,
        });
      }
    }

    return NextResponse.json(Object.values(grouped));
  } catch (e) {
    console.error('Organizer subscribers list error:', e);
    return NextResponse.json({ message: 'Internal error' }, { status: 500 });
  }
}
