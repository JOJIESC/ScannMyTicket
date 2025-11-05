import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";
import { getSessionUser } from "@/libs/auth";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const me = await getSessionUser();
    if (!me) return NextResponse.json({ message: "No autorizado" }, { status: 401 });

    // comprobar dueño/admin
    const own: any = await conn.query("SELECT user_id FROM events WHERE id = ?", [params.id]);
    if (!Array.isArray(own) || own.length === 0)
      return NextResponse.json({ message: "Evento no encontrado" }, { status: 404 });

    const isOwner = String(own[0].user_id) === String(me.id);
    const isAdmin = String(me.role ?? "").toUpperCase() === "ADMIN";
    if (!isOwner && !isAdmin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const rows: any = await conn.query(
      `SELECT s.id AS subscription_id, s.subscriber_id, s.created_at, s.expires_at, s.used_at, s.used_by_operator_email,
              u.email_address, u.first_name, u.last_name
         FROM subscriptions s
         JOIN users u ON u.id = s.subscriber_id
        WHERE s.subscribed_to = ?
        ORDER BY s.created_at DESC`,
      [params.id]
    );
    return NextResponse.json(Array.isArray(rows) ? rows : [], { status: 200 });
  } catch (e) {
    console.error("event subscribers error:", e);
    return NextResponse.json({ message: "Error listando suscriptores" }, { status: 500 });
  }
}
