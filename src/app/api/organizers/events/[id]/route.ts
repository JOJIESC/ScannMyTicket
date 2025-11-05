import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";
import { getSessionUser } from "@/libs/auth";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const me = await getSessionUser();
    if (!me) return NextResponse.json({ message: "No autorizado" }, { status: 401 });

    const data = await req.json();
    const allowed: any = {
      title: data.title,
      description: data.description,
      image_url: data.image_url,
      location: data.location,
      start: data.start,
      end: data.end,
      startTime: data.startTime,
      endTime: data.endTime,
    };

    const rows: any = await conn.query("SELECT user_id FROM events WHERE id = ?", [params.id]);
    if (!Array.isArray(rows) || rows.length === 0)
      return NextResponse.json({ message: "Evento no encontrado" }, { status: 404 });

    const isOwner = String(rows[0].user_id) === String(me.id);
    const isAdmin = String(me.role ?? "").toUpperCase() === "ADMIN";
    if (!isOwner && !isAdmin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const result: any = await conn.query("UPDATE events SET ? WHERE id = ?", [allowed, params.id]);
    if (result.affectedRows === 0)
      return NextResponse.json({ message: "Evento no encontrado" }, { status: 404 });

    return NextResponse.json({ message: "Evento actualizado", ...allowed }, { status: 200 });
  } catch (e) {
    console.error("event update error:", e);
    return NextResponse.json({ message: "error actualizando evento" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const me = await getSessionUser();
    if (!me) return NextResponse.json({ message: "No autorizado" }, { status: 401 });

    const row: any = await conn.query("SELECT user_id FROM events WHERE id = ?", [params.id]);
    if (!Array.isArray(row) || row.length === 0)
      return NextResponse.json({ message: "Evento no encontrado" }, { status: 404 });

    const isOwner = String(row[0].user_id) === String(me.id);
    const isAdmin = String(me.role ?? "").toUpperCase() === "ADMIN";
    if (!isOwner && !isAdmin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const res: any = await conn.query("DELETE FROM events WHERE id = ?", [params.id]);
    if (res.affectedRows === 0)
      return NextResponse.json({ message: "Evento no encontrado" }, { status: 404 });

    return NextResponse.json({ message: "Evento eliminado" }, { status: 200 });
  } catch (e) {
    console.error("event delete error:", e);
    return NextResponse.json({ message: "error eliminando evento" }, { status: 500 });
  }
}
