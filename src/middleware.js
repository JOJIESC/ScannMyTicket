import { NextResponse } from "next/server";
import { jwtVerify } from "jose";


export async function middleware(req) {
    // obtenemos el token de las cookies
    const cookies = req.headers.get('cookie');
    const ScannToken = cookies?.split('; ').find(row => row.startsWith('ScannToken='))?.split('=')[1];

    // si no hay token redirigimos a login
    if (ScannToken === undefined) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // validamos si el token es valido con la clave secreta
    try {
        const { payload } = await jwtVerify(ScannToken, new TextEncoder().encode('secretkey'));
        const { pathname } = req.nextUrl;
        const userRole = payload.role;

        // definir las rutas permitidas para cada rol
        const rolePermissions = {
            user: ['/User','/Organizer'],
            admin: ['/Admin', '/User', '/Organizer', '/Operator'],
            organizer: ['/Organizer', '/User', '/Operator'],
            operator: ['/Operator']
        }
                // verificar si la ruta solicitada está permitida para el rol del usuario
                const allowedPaths = rolePermissions[userRole] || [];
                const isPathAllowed = allowedPaths.some(path => pathname.includes(path));

                if (!isPathAllowed) {
                    return NextResponse.redirect(new URL('/Unaunthorized', req.url));
                }

        return NextResponse.next();
    } catch (error) {
        // si el token no es valido redirigimos a login
        console.log(error);
        return NextResponse.redirect(new URL('/login', req.url));
    }

}

// proteccion de las rutas y subrutas
export const config = {
    matcher: ['/User/:path*', '/Admin/:path*', '/Organizer/:path*', '/Operator/:path*']
}