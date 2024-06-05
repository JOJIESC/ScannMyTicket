import { NextRequest, NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string; eventId: string } }
) {
  try {
    const result = await conn.query(
      `
      SELECT * FROM subscriptions WHERE subscriber_id = ? AND subscribed_to = ?
    `,
      [params.userId, params.eventId]
    );

    if (!Array.isArray(result) || result.length === 0) {
      return NextResponse.json(
        { message: "Suscripción no encontrada" },
        { status: 404 }
      );
    }
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error obteniendo suscripción:", error);
    return NextResponse.json(
      { message: "Error obteniendo suscripción" },
      { status: 500 }
    );
  }
}
