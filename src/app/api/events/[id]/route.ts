import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const rows: any = await conn.query(
      `SELECT id, title, description, image_url, location, start, \`end\`,
              startTime, endTime, user_id
       FROM events WHERE id = ?`,
      [params.id]
    );
    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ message: "Evento no encontrado" }, { status: 404 });
    }
    return NextResponse.json(rows[0], { status: 200 });
  } catch (e) {
    console.error("event detail error:", e);
    return NextResponse.json({ message: "Error obteniendo evento" }, { status: 500 });
  }
}
