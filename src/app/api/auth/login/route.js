// Ruta: src/app/api/auth/login/route.js
import { NextResponse } from "next/server";
import { conn } from '@/libs/mysql';
// import bcrypt from 'bcryptjs'; // Hasheo DESHABILITADO
import jwt from 'jsonwebtoken';
import { serialize } from "cookie";

// Lee la clave secreta desde las variables de entorno
const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req, res) {
    // CORRECCIÓN: La validación de la clave va DENTRO de la función
    if (!JWT_SECRET) {
        console.error('ERROR FATAL: JWT_SECRET no está definida en /api/auth/login.');
        return NextResponse.json({ message: 'Error de configuración del servidor' }, { status: 500 });
    }
    
    try {
        const body = await req.json();
        // El frontend (login/page.tsx) envía 'email', así que recibimos 'email'
        const { email, password } = body; 

        if (!email || !password) {
            return NextResponse.json({ message: "Correo y contraseña requeridos" }, { status: 400 });
        }

        // 1. Busca al usuario por email_address
        const users = await conn.query('SELECT * FROM users WHERE email_address = ?', [email]);
        
        if (!Array.isArray(users) || users.length === 0) {
            return NextResponse.json({ message: "Credenciales inválidas" }, { status: 401 });
        }

        const usuario = users[0];

        // 2. --- CORRECCIÓN: COMPARACIÓN SIN HASHEO ---
        // Compara directamente la contraseña ingresada con la guardada en la BD
        const isMatch = (password === usuario.password); 

        if (!isMatch) {
            console.log(`Contraseña incorrecta para ${email}. Ingresada: '${password}', Guardada: '${usuario.password}'`);
            return NextResponse.json({ message: "Credenciales inválidas" }, { status: 401 });
        }

        // 3. Credenciales correctas, crea el payload del token
        const userPayload = {
            id: usuario.id,
            email_address: usuario.email_address, 
            first_name: usuario.first_name,
            last_name: usuario.last_name,
            role: usuario.role,
            avatar: usuario.avatar,
            birth_date: usuario.birth_date,
            phone_number: usuario.phone_number,
        };

        // 4. Crea el token JWT
        const token = jwt.sign(
            {
                exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 días
                user: userPayload // Anida los datos del usuario
            },
            JWT_SECRET // Usa la clave secreta desde .env
        );

        // 5. Crea la cookie segura
        const serialized = serialize('ScannToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict', 
            maxAge: 60 * 60 * 24 * 30,
            path: '/'
        });

        // 6. Retorna la respuesta
        const response = NextResponse.json(
            { user: userPayload, role: usuario.role },
            { status: 200 }
        );
        response.headers.set('Set-Cookie', serialized);
        return response;

    } catch (error) {
        console.error("Error fatal en login:", error);
        return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
    }
}