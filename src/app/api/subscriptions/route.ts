import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { conn } from "@/libs/mysql";

interface DecodedToken extends JwtPayload {
  id: number;
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get("ScannToken")?.value;
  if (!token) {
    return NextResponse.json({ message: "No token provided" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, "secretkey") as DecodedToken;

    if (typeof decoded === "string" || !decoded.id) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const userId = decoded.id;

    const query = `
      SELECT e.id, e.title, e.description, e.start, e.end, e.image_url
      FROM events e
      JOIN subscriptions s ON s.subscribed_to = e.id
      WHERE s.subscriber_id = ?
    `;
    const events = await conn.query(query, [userId]);

    await conn.end();

    console.log("Events:", events); 
    return NextResponse.json(events);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

