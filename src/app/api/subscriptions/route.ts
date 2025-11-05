// src/app/api/subscriptions/route.ts
import { NextResponse } from 'next/server';
import { conn } from '@/libs/mysql';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET!;
const secret = new TextEncoder().encode(JWT_SECRET);

export async function GET() {
  try {
    const token = cookies().get('ScannToken')?.value;
    if (!token) return NextResponse.json([], { status: 200 });
    const { payload } = await jwtVerify(token, secret);

    // token de usuario: payload.user.id; (fallback a id simple si hiciste login antiguo)
    const userId =
      (payload as any)?.user?.id ??
      (payload as any)?.id ??
      null;

    if (!userId) return NextResponse.json([], { status: 200 });

    const rows: any[] = await conn.query(
      `
      SELECT 
        e.id, e.title, e.description, e.image_url, e.location,
        e.start, e.end,
        s.used_at
      FROM subscriptions s
      JOIN events e ON e.id = s.subscribed_to
      WHERE s.subscriber_id = ?
      ORDER BY e.start DESC
      `,
      [userId]
    );

    return NextResponse.json(Array.isArray(rows) ? rows : [], { status: 200 });
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
