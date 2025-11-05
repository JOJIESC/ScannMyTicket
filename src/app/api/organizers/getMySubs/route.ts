import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function POST(req: Request) {
  try {
    const { user_id } = await req.json();
    if (!user_id) {
      return NextResponse.json({ message: "user_id no proporcionado" }, { status: 400 });
    }

    const rows = await conn.query(
      `
      SELECT 
        e.id   AS event_id,
        e.title AS event_title,
        e.start, e.\`end\`, e.location,
        u.id   AS user_id,
        CONCAT(COALESCE(u.first_name,''),' ',COALESCE(u.last_name,'')) AS subscriber_name,
        u.email_address AS subscriber_email
      FROM events e
      LEFT JOIN subscriptions s ON s.subscribed_to = e.id
      LEFT JOIN users u         ON u.id = s.subscriber_id
      WHERE e.user_id = ?
      ORDER BY e.start DESC, subscriber_name ASC
      `,
      [user_id]
    );

    return NextResponse.json(Array.isArray(rows) ? rows : []);
  } catch (error) {
    console.error("getMySubs error:", error);
    return NextResponse.json({ message: "error obteniendo suscriptores" }, { status: 500 });
  }
}
