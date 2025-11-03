// Ruta: src/app/api/auth/PROFILE/route.js
import { NextResponse } from "next/server";
import { jwtVerify } from "jose"; // Usar jose, igual que el middleware
import { cookies } from "next/headers";

// Lee la clave secreta desde las variables de entorno
const JWT_SECRET = process.env.JWT_SECRET;

// Pre-calcula la clave para 'jose'
let secretKeyUint8Array;
if (JWT_SECRET) {
    secretKeyUint8Array = new TextEncoder().encode(JWT_SECRET);
}

export async function GET(req, res) {
    // *** CORRECCIÓN: Validamos la clave DENTRO de la función ***
    if (!JWT_SECRET || !secretKeyUint8Array) {
        console.error('ERROR FATAL: JWT_SECRET no está definida en /api/auth/PROFILE.');
        return NextResponse.json({ message: 'Error de configuración del servidor' }, { status: 500 });
    }

    const cookieStore = cookies();
    const tokenCookie = cookieStore.get('ScannToken');
    const token = tokenCookie?.value;

    if (!token) {
        return NextResponse.json({ message: 'No se proporcionó token' }, { status: 401 });
    }

    try {
        // 1. Verificamos el token con 'jose' y la clave CORRECTA
        const { payload } = await jwtVerify(token, secretKeyUint8Array);

        // 2. Verificamos la estructura (que contenga 'user')
        if (typeof payload.user !== 'object' || !payload.user.id) {
             throw new Error("Estructura de token inválida");
        }
        
        // 3. Retornamos los datos que el frontend espera
        const userProfile = {
            id: payload.user.id,
            email_address: payload.user.email_address,
            username: payload.user.first_name, 
            first_name: payload.user.first_name,
            last_name: payload.user.last_name,
            role: payload.user.role,
            avatar: payload.user.avatar,
            birth_date: payload.user.birth_date, 
            phone_number: payload.user.phone_number 
        };

        return NextResponse.json(userProfile, { status: 200 });

    } catch (err) {
        console.error("Error al verificar token en PROFILE:", err.code || err.message);
        const response = NextResponse.json({ message: 'Token inválido o expirado' }, { status: 401 });
        response.cookies.set('ScannToken', '', { maxAge: -1, path: '/' }); 
        return response;
    }
}