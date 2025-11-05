import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Usa la misma clave que en login/PROFILE
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secretkey_muy_insegura');

// Rutas públicas base
const PUBLIC_BASE_PATHS = ['/login', '/signup', '/LoginOperator', '/Unaunthorized', '/'];

function isPublic(pathname) {
  // Normaliza: quita slash final excepto root
  const p = pathname !== '/' && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  return PUBLIC_BASE_PATHS.some(base => p === base || p.startsWith(base + '/'));
}

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Evitar aplicar a API y estáticos
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/img') ||
    pathname.endsWith('.ico')
  ) {
    return NextResponse.next();
  }

  // Permitir rutas públicas (incluye `/signup` y subrutas)
  if (isPublic(pathname)) return NextResponse.next();

  // Desde aquí, requiere token
  const token = req.cookies.get('ScannToken')?.value;
  if (!token) return NextResponse.redirect(new URL('/login', req.url));

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!payload.user?.role) throw new Error('Token inválido');

    const userRole = String(payload.user.role).toUpperCase();
    const pathRoot = pathname.split('/')[1]?.toLowerCase();

    // Autorización por rol / área
    if (pathRoot === 'admin' && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/Unaunthorized', req.url));
    }
    if (pathRoot === 'operator' && userRole !== 'OPERATOR') {
      return NextResponse.redirect(new URL('/Unaunthorized', req.url));
    }
    if (pathRoot === 'user' && userRole !== 'USER' && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/Unaunthorized', req.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error('Error verificando token en middleware:', err?.message || err);
    const response = NextResponse.redirect(new URL('/login', req.url));
    // Borra cookie inválida
    response.cookies.delete('ScannToken');
    return response;
  }
}

// Configuración del Matcher
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|img/.*\\.).*)'],
};
