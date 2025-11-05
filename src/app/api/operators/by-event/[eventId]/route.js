import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

async function canManageEvent(eventId) {
  const token = cookies().get("ScannToken")?.value;
  if (!token) return false;
  const sec = process.env.JWT_SECRET;
  if (!sec) return false;

  const { payload } = await jwtVerify(token, new TextEncoder().encode(sec));
  const me = payload?.user;
  if (!me) return false;

  // Dueño del evento o ADMIN
  const rows = await conn.query("SELECT user_id FROM events WHERE id = ?", [eventId]);
  if (!Array.isArray(rows) || rows.length === 0) return false;

  const isOwner = String(rows[0].user_id) === String(me.id);
  const isAdmin = String((me.role || "")).toUpperCase() === "ADMIN";
  return isOwner || isAdmin;
}

export async function GET(_req, { params }) {
  try {
    const eventId = params.eventId;
    if (!eventId) return NextResponse.json({ message: "Falta eventId" }, { status: 400 });

    const allowed = await canManageEvent(eventId);
    if (!allowed) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const rows = await conn.query(
      "SELECT id, email_address FROM operators WHERE event_id = ? ORDER BY id DESC",
      [eventId]
    );

    return NextResponse.json(Array.isArray(rows) ? rows : []);
  } catch (e) {
    console.error("operators/by-event error:", e);
    return NextResponse.json({ message: "Error listando operadores" }, { status: 500 });
  }
}
