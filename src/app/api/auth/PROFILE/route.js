// Ruta: src/app/api/auth/PROFILE/route.js
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET;

let secretKeyUint8Array;
if (JWT_SECRET) {
  secretKeyUint8Array = new TextEncoder().encode(JWT_SECRET);
}

export async function GET() {
  if (!JWT_SECRET || !secretKeyUint8Array) {
    console.error("ERROR FATAL: JWT_SECRET no está definida en /api/auth/PROFILE.");
    return NextResponse.json({ message: "Error de configuración del servidor" }, { status: 500 });
  }

  const token = cookies().get("ScannToken")?.value;
  if (!token) {
    return NextResponse.json({ message: "No se proporcionó token" }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token, secretKeyUint8Array);

    if (typeof payload.user !== "object" || !payload.user.id) {
      throw new Error("Estructura de token inválida");
    }

    const u = payload.user;

    const userProfile = {
      id: u.id,
      email_address: u.email_address || null,
      username: u.first_name || null, // (tu front lo usa así)
      first_name: u.first_name || null,
      last_name: u.last_name || null,
      role: u.role,                  // USER | ORGANIZER | ADMIN | OPERATOR
      avatar: u.avatar || null,
      birth_date: u.birth_date || null,
      phone_number: u.phone_number || null,
      // 🔽 si es operador, exponemos el event_id para su vista
      operator: u.operator || null,  // { event_id } | null
    };

    return NextResponse.json(userProfile, { status: 200 });
  } catch (err) {
    console.error("Error al verificar token en PROFILE:", err?.code || err?.message);
    const response = NextResponse.json({ message: "Token inválido o expirado" }, { status: 401 });
    response.cookies.set("ScannToken", "", { maxAge: -1, path: "/" });
    return response;
  }
}
