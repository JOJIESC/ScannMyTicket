import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";
import { getSessionUser } from "@/libs/auth";

async function canManageByOperator(operatorId: string | number) {
  const me = await getSessionUser();
  if (!me) return false;

  const rows: any = await conn.query(
    `SELECT e.user_id 
       FROM operators o 
       JOIN events e ON e.id = o.event_id
      WHERE o.id = ?`,
    [operatorId]
  );

  if (!Array.isArray(rows) || rows.length === 0) return false;

  const isOwner = String(rows[0].user_id) === String(me.id);
  const isAdmin = String(me.role ?? "").toUpperCase() === "ADMIN";
  return isOwner || isAdmin;
}

export async function DELETE(_req: Request, { params }: { params: { id: string; opId: string } }) {
  try {
    const allowed = await canManageByOperator(params.opId);
    if (!allowed) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const res: any = await conn.query("DELETE FROM operators WHERE id = ?", [params.opId]);
    if (res.affectedRows === 0) {
      return NextResponse.json({ message: "Operador no encontrado" }, { status: 404 });
    }
    return NextResponse.json({ message: "Operador eliminado" }, { status: 200 });
  } catch (e) {
    console.error("operators delete error:", e);
    return NextResponse.json({ message: "Error eliminando operador" }, { status: 500 });
  }
}
