import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";
import { getSessionUser } from "@/libs/auth";

async function assertCanManageEvent(eventId: string | number) {
  const me = await getSessionUser();
  if (!me) return { ok: false, status: 401, message: "No autorizado" };

  const rows: any = await conn.query("SELECT id, user_id FROM events WHERE id = ?", [eventId]);
  if (!Array.isArray(rows) || rows.length === 0)
    return { ok: false, status: 404, message: "Evento no encontrado" };

  const isOwner = String(rows[0].user_id) === String(me.id);
  const isAdmin = String(me.role ?? "").toUpperCase() === "ADMIN";
  if (!isOwner && !isAdmin)
    return { ok: false, status: 403, message: "Forbidden: no eres dueño de este evento" };

  return { ok: true };
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await assertCanManageEvent(params.id);
    if (!auth.ok) return NextResponse.json({ message: auth.message }, { status: auth.status });

    const rows: any = await conn.query(
      "SELECT id, email_address, event_id FROM operators WHERE event_id = ? ORDER BY id DESC",
      [params.id]
    );
    return NextResponse.json(Array.isArray(rows) ? rows : [], { status: 200 });
  } catch (e) {
    console.error("operators list error:", e);
    return NextResponse.json({ message: "Error listando operadores" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await assertCanManageEvent(params.id);
    if (!auth.ok) return NextResponse.json({ message: auth.message }, { status: auth.status });

    const body = await req.json();
    const items = Array.isArray(body) ? body : [body];

    const values = items.map((i: any) => [
      i.email_address ?? i.email,
      i.password ?? "123456",
      params.id,
    ]);

    const sql = `
      INSERT INTO operators (email_address, password, event_id)
      VALUES ?
      ON DUPLICATE KEY UPDATE password = VALUES(password)`;
    // @ts-ignore
    await conn.query(sql, [values]);

    return NextResponse.json({ message: "Operadores agregados" }, { status: 200 });
  } catch (e) {
    console.error("operators create error:", e);
    return NextResponse.json({ message: "Error creando operadores" }, { status: 500 });
  }
}
