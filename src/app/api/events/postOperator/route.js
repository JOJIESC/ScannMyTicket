import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

async function canManageEvent(eventId) {
  const token = cookies().get("ScannToken")?.value;
  if (!token) return false;
  const sec = process.env.JWT_SECRET;
  const { payload } = await jwtVerify(token, new TextEncoder().encode(sec));
  const me = payload?.user;
  if (!me) return false;

  const rows = await conn.query("SELECT user_id FROM events WHERE id = ?", [eventId]);
  if (!Array.isArray(rows) || rows.length === 0) return false;

  const isOwner = String(rows[0].user_id) === String(me.id);
  const isAdmin = String((me.role || "")).toUpperCase() === "ADMIN";
  return isOwner || isAdmin;
}

export async function POST(req) {
  try {
    const items = await req.json(); // [{ email | email_address, password, event_id }, ...]
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ message: "Payload inválido" }, { status: 400 });
    }

    const event_id = items[0].event_id;
    if (!event_id) {
      return NextResponse.json({ message: "Falta event_id" }, { status: 400 });
    }
    const allowed = await canManageEvent(event_id);
    if (!allowed) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    // Inserta uno por uno validando duplicados
    for (const raw of items) {
      const email_address = raw.email_address ?? raw.email; // admite 'email' desde el front
      const password = raw.password;
      const evId = raw.event_id ?? event_id;

      if (!email_address || !password || !evId) continue;

      // Si quieres permitir mismo correo en varios eventos, ver nota al final.
      // Con el esquema actual (UNIQUE email_address) esto falla si ya existe.
      // Verificamos y evitamos romper el lote.
      const exists = await conn.query(
        "SELECT id FROM operators WHERE email_address = ?",
        [email_address]
      );
      if (Array.isArray(exists) && exists.length > 0) {
        // ya existe ese email (independiente del evento) -> lo ignoramos
        continue;
      }

      await conn.query("INSERT INTO operators SET ?", {
        email_address,
        password,     // ⚠️ Texto plano (igual que el resto de tu app actual)
        event_id: evId
      });
    }

    return NextResponse.json({ message: "Operadores creados" }, { status: 200 });
  } catch (error) {
    console.error("postOperator error:", error);
    return NextResponse.json({ message: "Error creando operadores" }, { status: 500 });
  }
}
