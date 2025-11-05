import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";
import { getSessionUser } from "@/libs/auth";

async function canManageBySubscription(subId: string | number) {
  const me = await getSessionUser();
  if (!me) return false;

  const rows: any = await conn.query(
    `SELECT e.user_id
       FROM subscriptions s
       JOIN events e ON e.id = s.subscribed_to
      WHERE s.id = ?`,
    [subId]
  );
  if (!Array.isArray(rows) || rows.length === 0) return false;
  const isOwner = String(rows[0].user_id) === String(me.id);
  const isAdmin = String(me.role ?? "").toUpperCase() === "ADMIN";
  return isOwner || isAdmin;
}

export async function DELETE(_req: Request, { params }: { params: { id: string; subscriptionId: string } }) {
  try {
    const allowed = await canManageBySubscription(params.subscriptionId);
    if (!allowed) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const res: any = await conn.query("DELETE FROM subscriptions WHERE id = ?", [params.subscriptionId]);
    if (res.affectedRows === 0)
      return NextResponse.json({ message: "Suscripción no encontrada" }, { status: 404 });

    return NextResponse.json({ message: "Suscripción revocada" }, { status: 200 });
  } catch (e) {
    console.error("subscription delete error:", e);
    return NextResponse.json({ message: "Error revocando suscripción" }, { status: 500 });
  }
}
