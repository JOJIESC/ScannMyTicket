import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { conn } from "@/libs/mysql";

export async function GET() {
  const token = cookies().get("ScannToken")?.value;
  if (!token) {
    return NextResponse.json({ message: "No token provided" }, { status: 401 });
  }
  const sec = process.env.JWT_SECRET;
  if (!sec) {
    console.error("JWT_SECRET no definido en /api/subscriptions");
    return NextResponse.json({ message: "Server misconfigured" }, { status: 500 });
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(sec));
    const user = payload.user;
    if (!user?.id) {
      return NextResponse.json({ message: "Invalid token payload" }, { status: 401 });
    }

    const query = `
      SELECT e.id, e.title, e.description, e.start, e.end, e.image_url, e.location, e.startTime, e.endTime
      FROM events e
      JOIN subscriptions s ON s.subscribed_to = e.id
      WHERE s.subscriber_id = ?
      ORDER BY e.start DESC
    `;
    const events = await conn.query(query, [user.id]);

    return NextResponse.json(Array.isArray(events) ? events : []);
  } catch (err) {
    console.error("subscriptions GET error:", err?.message || err);
    if (String(err?.message || '').includes('JWTExpired')) {
      const res = NextResponse.json({ message: "Token expired" }, { status: 401 });
      res.cookies.set("ScannToken", "", { maxAge: -1, path: "/" });
      return res;
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
