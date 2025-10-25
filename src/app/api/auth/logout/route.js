// Ruta: src/app/api/auth/logout/route.js
import { serialize } from "cookie";
import { NextResponse } from 'next/server';

// CORRECCIÓN: Logout debe ser POST por seguridad (evita CSRF vía GET)
export async function POST(req, res) {
    try {
        // Crea una cookie serializada con fecha de expiración en el pasado para borrarla
        const serialized = serialize('ScannToken', '', { // Valor vacío
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // True en producción (HTTPS)
            sameSite: 'strict', // Más seguro que 'lax'
            maxAge: -1, // Expira inmediatamente
            path: '/' // Asegura que la cookie se borre en todo el sitio
        });
 
        // Crea la respuesta y establece la cabecera para borrar la cookie
        const response = NextResponse.json(
            { message: 'Logout exitoso' },
            { status: 200 } // OK
        );
        response.headers.set('Set-Cookie', serialized); // Envía la cookie expirada
        return response;

    } catch (error) {
        console.error("Error en logout:", error);
        return NextResponse.json({ message: 'Error interno al cerrar sesión' }, { status: 500 });
    }
}

// Opcional: Puedes añadir un GET que simplemente devuelva un error 405 Method Not Allowed
export async function GET(req) {
     return NextResponse.json({ message: 'Método no permitido. Usa POST para logout.' }, { status: 405 });
}