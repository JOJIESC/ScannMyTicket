import { NextResponse } from "next/server";
import { conn } from '@/libs/mysql';
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

async function currentUser() {
  const token = cookies().get('ScannToken')?.value;
  if (!token) return null;
  const sec = process.env.JWT_SECRET;
  if (!sec) throw new Error('JWT_SECRET missing');
  const { payload } = await jwtVerify(token, new TextEncoder().encode(sec));
  return payload.user || null;
}

export async function GET(req, { params }) {
  try {
    const rows = await conn.query('SELECT * FROM events WHERE id = ?', [params.id]);
    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ message: "Evento no encontrado" }, { status: 404 });
    }
    const e = rows[0];
    const fmt = (d) => {
      if (!d) return d;
      const date = new Date(d);
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    };
    e.start = fmt(e.start);
    e.end   = fmt(e.end);
    return NextResponse.json(e);
  } catch (error) {
    return NextResponse.json({ message: "error obteniendo evento" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const me = await currentUser();
    if (!me) return NextResponse.json({ message: 'No autorizado' }, { status: 401 });

    const rows = await conn.query('SELECT user_id FROM events WHERE id = ?', [params.id]);
    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ message: "Evento no encontrado" }, { status: 404 });
    }
    const isOwner = String(rows[0].user_id) === String(me.id);
    const isAdmin = String(me.role || '').toUpperCase() === 'ADMIN';
    if (!isOwner && !isAdmin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const data = await req.json();
    const result = await conn.query('UPDATE events SET ? WHERE id = ?', [data, params.id]);
    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "Evento no encontrado" }, { status: 404 });
    }
    return NextResponse.json({ message: "Evento actualizado", ...data });
  } catch (error) {
    return NextResponse.json({ message: "error actualizando evento" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const me = await currentUser();
    if (!me) return NextResponse.json({ message: 'No autorizado' }, { status: 401 });

    const rows = await conn.query('SELECT user_id FROM events WHERE id = ?', [params.id]);
    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ message: "Evento no encontrado" }, { status: 404 });
    }
    const isOwner = String(rows[0].user_id) === String(me.id);
    const isAdmin = String(me.role || '').toUpperCase() === 'ADMIN';
    if (!isOwner && !isAdmin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const result = await conn.query('DELETE FROM events WHERE id = ?', [params.id]);
    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "Evento no encontrado" }, { status: 404 });
    }
    return NextResponse.json({ message: "Evento eliminado" });
  } catch (error) {
    return NextResponse.json({ message: "error eliminando evento" }, { status: 500 });
  }
}
