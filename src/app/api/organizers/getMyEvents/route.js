import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function POST(req) {
  try {
    // Opción A: confiar en el body (lo tienes así ahora)
    const { user_id } = await req.json();

    // Opción B (más segura): tomarlo del token:
    // const token = cookies().get('ScannToken')?.value;
    // const sec = process.env.JWT_SECRET;
    // const { payload } = await jwtVerify(token, new TextEncoder().encode(sec));
    // const user_id = payload.user?.id;

    if (!user_id) return NextResponse.json({ message: 'user_id requerido' }, { status: 400 });

    const rows = await conn.query(
      'SELECT * FROM events WHERE user_id = ? ORDER BY start DESC',
      [user_id]
    );

    return NextResponse.json(Array.isArray(rows) ? rows : []);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error obteniendo eventos' }, { status: 500 });
  }
}
