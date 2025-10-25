import { NextResponse } from "next/server";
import { conn } from '@/libs/mysql';
import bcrypt from 'bcryptjs'; // Importa bcryptjs
import jwt from 'jsonwebtoken';
import { serialize } from "cookie";

// Lee la clave secreta desde las variables de entorno
const JWT_SECRET = process.env.JWT_SECRET;

// Valida que la clave secreta exista al iniciar el servidor
if (!JWT_SECRET) {
    throw new Error('La variable de entorno JWT_SECRET no está definida. Verifica tu archivo .env o .env.local');
}

export async function POST(req, res) {
    try {
        const body = await req.json();
        // Asegúrate de que los nombres coincidan con el frontend (ej. email vs email_address)
        const { email, password } = body; 

        if (!email || !password) {
            return NextResponse.json({ message: "Correo y contraseña requeridos" }, { status: 400 });
        }

        // Busca al usuario SOLO por email_address en la BD
        const users = await conn.query('SELECT * FROM users WHERE email_address = ?', [email]);
        
        if (!Array.isArray(users) || users.length === 0) {
            console.log("Usuario no encontrado:", email);
            return NextResponse.json({ message: "Credenciales inválidas" }, { status: 401 });
        }

        const usuario = users[0];

        // Compara la contraseña ingresada con la hasheada en la BD
        const isMatch = await bcrypt.compare(password, usuario.password);

        if (!isMatch) {
            console.log("Contraseña incorrecta para:", email);
            return NextResponse.json({ message: "Credenciales inválidas" }, { status: 401 });
        }

        // Credenciales correctas, crea el payload del token
        const userPayload = {
            id: usuario.id,
            // Usa email_address consistentemente si ese es el campo en tu BD/token
            email_address: usuario.email_address, 
            first_name: usuario.first_name,
            last_name: usuario.last_name,
            role: usuario.role, // Asegúrate que este campo exista y tenga valor en la BD
            avatar: usuario.avatar
        };

        // Crea el token JWT
        const token = jwt.sign(
            {
                exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // Expira en 30 días
                user: userPayload // Anida los datos del usuario consistentemente
            },
            JWT_SECRET // Usa la clave secreta desde .env
        );

        // Crea la cookie segura con el token
        const serialized = serialize('ScannToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict', 
            maxAge: 60 * 60 * 24 * 30, // 30 días en segundos
            path: '/'
        });

        // Retorna la respuesta con la cookie y datos del usuario
        const response = NextResponse.json(
            { user: userPayload }, // Devuelve los datos del usuario (sin contraseña hash)
            { status: 200 }
        );
        response.headers.set('Set-Cookie', serialized);
        return response;

    } catch (error) {
        console.error("Error en login:", error);
        return NextResponse.json({ message: "Error interno del servidor durante el inicio de sesión" }, { status: 500 });
    }
}

// Opcional: Añadir un GET si es necesario, pero usualmente login es solo POST
// export async function GET() { ... } 

