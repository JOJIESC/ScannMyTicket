import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function POST(req: Request) {
  try {
    const { user_id } = await req.json();
    if (!user_id) return NextResponse.json({ message: "user_id requerido" }, { status: 400 });

    const rows: any = await conn.query(
      `SELECT COUNT(*) AS total_events FROM events WHERE user_id = ?`,
      [user_id]
    );

    // rows puede ser unknown -> lo tipamos como any y devolvemos el primer objeto
    const first = Array.isArray(rows) ? rows[0] : rows;
    return NextResponse.json([first], { status: 200 });
  } catch (e) {
    console.error("countMyEvents error:", e);
    return NextResponse.json({ message: "error contando eventos" }, { status: 500 });
  }
}
