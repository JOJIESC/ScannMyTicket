import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Asegúrate de usar la misma clave secreta que en el login/registro
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secretkey_muy_insegura');

export async function middleware(req) {
    const { pathname } = req.nextUrl; // Obtiene la ruta solicitada

    // Rutas públicas que no requieren autenticación
    const publicPaths = ['/login', '/signup', '/LoginOperator', '/Unaunthorized', '/']; 
    // Evita aplicar el middleware a las rutas de API y archivos estáticos
    if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.startsWith('/img') || pathname.endsWith('.ico')) {
        return NextResponse.next();
    }
    // Si es una ruta pública, permite el acceso sin verificar token
    if (publicPaths.includes(pathname)) {
         return NextResponse.next();
    }


    // Intenta obtener el token de las cookies
    const tokenCookie = req.cookies.get('ScannToken');
    const token = tokenCookie?.value;

    // Si no hay token Y NO es una ruta pública, redirige a login
    if (!token) {
        console.log("Middleware: No hay token, redirigiendo a login desde", pathname);
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // Si hay token, intenta verificarlo
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        
        // Asegúrate de que el payload tiene la estructura esperada
        if (!payload.user || !payload.user.role) {
             throw new Error("Token inválido - falta payload.user o payload.user.role");
        }

        const userRole = payload.user.role.toUpperCase(); // Asegura que el rol esté en mayúsculas

        // Definir rutas permitidas (usa startsWith para cubrir subrutas)
        const rolePermissions = {
            USER: ['/User', '/Organizer'], // Permite acceso a /User y /Organizer
            ADMIN: ['/Admin', '/User', '/Organizer', '/Operator'],
            ORGANIZER: ['/Organizer', '/User'],
            OPERATOR: ['/Operator']
        };

        const allowedPaths = rolePermissions[userRole] || [];
        
        // Verificar si la ruta solicitada comienza con alguna de las permitidas
        const isPathAllowed = allowedPaths.some(path => pathname.startsWith(path));

        if (!isPathAllowed) {
            console.log(`Middleware: Rol ${userRole} no tiene permiso para ${pathname}, redirigiendo a /Unaunthorized`);
            return NextResponse.redirect(new URL('/Unaunthorized', req.url));
        }

        // Si tiene permiso, permite continuar
        console.log(`Middleware: Rol ${userRole} tiene permiso para ${pathname}`);
        return NextResponse.next();

    } catch (error) {
        // Si el token es inválido (expirado, malformado, clave incorrecta)
        console.error("Middleware: Error verificando token -", error.message);
        const response = NextResponse.redirect(new URL('/login', req.url));
        // Borra la cookie inválida
        response.cookies.delete('ScannToken'); 
        return response;
    }
}

// Configuración del Matcher: Aplica a todas las rutas excepto las especificadas
export const config = {
  matcher: [
    /*
     * Coincide con todas las rutas excepto:
     * - api (rutas API)
     * - _next/static (archivos estáticos)
     * - _next/image (optimización de imágenes)
     * - favicon.ico (ícono de la pestaña)
     * - Archivos dentro de /public (imágenes, etc.) que contengan un punto (ej. .png)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|img/.*\\.).*)',
  ]
}
