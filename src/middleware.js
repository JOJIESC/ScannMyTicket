import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback_secretkey_muy_insegura"
);

// Rutas públicas base
const PUBLIC_BASE_PATHS = ["/login", "/signup", "/LoginOperator", "/Unaunthorized", "/"];

function normalize(pathname) {
  if (pathname !== "/" && pathname.endsWith("/")) return pathname.slice(0, -1);
  return pathname;
}

function isPublic(pathname) {
  const p = normalize(pathname);
  return PUBLIC_BASE_PATHS.some((base) => p === base || p.startsWith(base + "/"));
}

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Evitar aplicar a API y estáticos
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/img") ||
    pathname.endsWith(".ico")
  ) {
    return NextResponse.next();
  }

  // Permitir rutas públicas (incluye `/signup` y `/signup/...`)
  if (isPublic(pathname)) return NextResponse.next();

  // Requiere token desde aquí
  const token = req.cookies.get("ScannToken")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const role = payload?.user?.role;
    if (!role) throw new Error("Token inválido");

    const userRole = String(role).toUpperCase();
    const rolePermissions = {
      USER: ["/User", "/Organizer"],
      ADMIN: ["/Admin", "/User", "/Organizer", "/Operator"],
      ORGANIZER: ["/Organizer", "/User"],
      OPERATOR: ["/Operator"],
    };

    const allowed = rolePermissions[userRole] || [];
    const ok = allowed.some((base) => pathname === base || pathname.startsWith(base + "/"));
    if (!ok) {
      return NextResponse.redirect(new URL("/Unaunthorized", req.url));
    }

    return NextResponse.next();
  } catch (e) {
    const resp = NextResponse.redirect(new URL("/login", req.url));
    resp.cookies.delete("ScannToken");
    return resp;
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|img/.*\\.).*)"],
};
