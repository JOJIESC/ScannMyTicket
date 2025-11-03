// Ruta: src/app/api/users/new/route.js
import { NextResponse } from "next/server";
import { conn } from '@/libs/mysql';
// import bcrypt from 'bcryptjs'; // Hasheo DESHABILITADO

export async function POST(req, res) {
    try {
        const { email_address, first_name, last_name, phone_number, password, birth_date, avatar } = await req.json();

        // 1. Validación básica
        if (!email_address || !password || !first_name || !last_name) {
            return NextResponse.json({ message: "Faltan campos requeridos" }, { status: 400 });
        }

        // 2. Verificar si el usuario ya existe
        const existingUser = await conn.query('SELECT id FROM users WHERE email_address = ?', [email_address]);
        if (Array.isArray(existingUser) && existingUser.length > 0) {
            return NextResponse.json({ message: "El correo electrónico ya está en uso" }, { status: 409 });
        }

        // 3. --- CORRECCIÓN: GUARDAR EN TEXTO PLANO ---
        const plainPassword = password; 

        // 4. Preparar fecha
        const formattedBirthDate = birth_date ? new Date(birth_date).toISOString().split('T')[0] : null;

        // 5. Insertar usuario
        const result = await conn.query('INSERT INTO users SET ?', {
            email_address: email_address,
            first_name: first_name,
            last_name: last_name,
            phone_number: phone_number || null,
            password: plainPassword, // Guarda la contraseña en texto plano
            birth_date: formattedBirthDate, 
            avatar: avatar || "Black.png", // Avatar por defecto
            role: 'user' 
        });
        
        if (!result || typeof result.insertId !== 'number') {
             throw new Error("La inserción en la base de datos no devolvió un ID.");
        }

        // 6. Devolver usuario (sin contraseña)
        const newUser = {
            id: result.insertId,
            email_address,
            first_name,
            last_name,
            role: 'user' 
        };

        return NextResponse.json(newUser, { status: 201 }); // 201 Created

    } catch (error) {
        console.error("Error en registro:", error);
        let errorMessage = "Error creando usuario.";
        let statusCode = 500;
        if (error instanceof Error && error.message.includes('Duplicate entry')) {
             errorMessage = "El correo electrónico ya está en uso";
             statusCode = 409;
        }
        return NextResponse.json({ message: errorMessage }, { status: statusCode });
    }
}