import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function GET(req, { params }) {
  try {
    const token = cookies().get("ScannToken")?.value;
    if (!token) return NextResponse.json({ message: "No token" }, { status: 401 });

    const sec = process.env.JWT_SECRET;
    if (!sec) return NextResponse.json({ message: "Server misconfigured" }, { status: 500 });

    const { payload } = await jwtVerify(token, new TextEncoder().encode(sec));
    const tokenUserId = payload?.user?.id;
    if (!tokenUserId) return NextResponse.json({ message: "Invalid token payload" }, { status: 401 });

    if (String(tokenUserId) !== String(params.userId)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const result = await conn.query(
      'SELECT * FROM subscriptions WHERE subscriber_id = ? AND subscribed_to = ?',
      [params.userId, params.eventId]
    );

    if (!Array.isArray(result) || result.length === 0) {
      return NextResponse.json({ message: "Suscripción no encontrada" }, { status: 404 });
    }
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error obteniendo suscripción:", error);
    return NextResponse.json({ message: "Error obteniendo suscripción" }, { status: 500 });
  }
}
