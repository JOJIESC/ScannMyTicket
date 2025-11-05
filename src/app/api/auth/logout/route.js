// Ruta: src/app/api/auth/logout/route.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Usar POST es más seguro para cerrar sesión
export async function POST(req, res) {
    try {
        const cookieStore = cookies();
        
        // Borra la cookie estableciendo su edad máxima a -1
        cookieStore.set('ScannToken', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'strict', 
            maxAge: -1, // Expira inmediatamente
            path: '/' 
        });
 
        const response = NextResponse.json(
            { message: 'Logout exitoso' },
            { status: 200 }
        );
        return response;

    } catch (error) {
        console.error("Error en logout:", error);
        return NextResponse.json({ message: 'Error interno al cerrar sesión' }, { status: 500 });
    }
}

// Añadimos GET para evitar errores si se llama accidentalmente
export async function GET(req) {
     return NextResponse.json({ message: 'Método no permitido. Usa POST para logout.' }, { status: 405 });
}