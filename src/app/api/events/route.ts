import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

// GET /api/events  -> lista general (pública)
export async function GET() {
  try {
    const rows: any = await conn.query(
      `SELECT id, title, description, image_url, location, start, \`end\`
       FROM events
       ORDER BY start DESC`
    );
    return NextResponse.json(Array.isArray(rows) ? rows : [], { status: 200 });
  } catch (e) {
    console.error("public events error:", e);
    return NextResponse.json({ message: "Error obteniendo eventos" }, { status: 500 });
  }
}
