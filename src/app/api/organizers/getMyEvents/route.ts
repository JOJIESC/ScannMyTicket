import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function POST(req: Request) {
  try {
    const { user_id } = await req.json();
    if (!user_id) return NextResponse.json({ message: "user_id requerido" }, { status: 400 });

    const rows: any = await conn.query(
      "SELECT * FROM events WHERE user_id = ? ORDER BY start DESC",
      [user_id]
    );
    return NextResponse.json(Array.isArray(rows) ? rows : [], { status: 200 });
  } catch (e) {
    console.error("getMyEvents error:", e);
    return NextResponse.json({ message: "Error obteniendo eventos" }, { status: 500 });
  }
}
