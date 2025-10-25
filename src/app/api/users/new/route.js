import { NextResponse } from "next/server";
import { conn } from '@/libs/mysql';
import bcrypt from 'bcryptjs'; // Importa bcryptjs

export async function POST(req, res) {
    try {
        const { email_address, first_name, last_name, phone_number, password, birth_date, avatar } = await req.json();

        // Validación básica
        if (!email_address || !password || !first_name || !last_name) {
            return NextResponse.json({ message: "Faltan campos requeridos: email, contraseña, nombre, apellido" }, { status: 400 });
        }
         // Validar longitud mínima de contraseña (ejemplo: 6 caracteres)
         if (password.length < 6) {
              return NextResponse.json({ message: "La contraseña debe tener al menos 6 caracteres" }, { status: 400 });
         }

        // Verificar si el usuario ya existe
        const existingUser = await conn.query('SELECT id FROM users WHERE email_address = ?', [email_address]);
        // serverless-mysql devuelve un array, incluso para SELECT de un solo campo
        if (Array.isArray(existingUser) && existingUser.length > 0) {
            return NextResponse.json({ message: "El correo electrónico ya está en uso" }, { status: 409 }); // 409 Conflict
        }

        // Hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insertar usuario con contraseña hasheada y rol por defecto
        const result = await conn.query('INSERT INTO users SET ?', {
            email_address: email_address,
            first_name: first_name,
            last_name: last_name,
            phone_number: phone_number || null, // Guarda null si no se proporciona
            password: hashedPassword, // Guarda la contraseña hasheada
            birth_date: birth_date ? new Date(birth_date) : null, // Asegura formato Date o null
            avatar: avatar || null, // Guarda null si no se proporciona
            role: 'user' // Asigna rol 'user' por defecto
        });
        
        // serverless-mysql devuelve un objeto con insertId en queries INSERT
        if (!result || typeof result.insertId !== 'number') {
             throw new Error("La inserción en la base de datos no devolvió un ID.");
        }


        // Devolver usuario sin la contraseña
        const newUser = {
            id: result.insertId,
            email_address,
            first_name,
            last_name,
            role: 'user' 
            // No devolver datos sensibles como teléfono, fecha nac., avatar aquí
        };

        return NextResponse.json(newUser, { status: 201 }); // 201 Created

    } catch (error) {
        console.error("Error en registro:", error);
        let errorMessage = "Error creando usuario";
        let statusCode = 500;

        // Manejar errores específicos de la base de datos si es posible
        if (error instanceof Error && error.message.includes('Duplicate entry')) {
             errorMessage = "El correo electrónico ya está en uso";
             statusCode = 409; // Conflict
        } else if (error instanceof Error) {
             errorMessage = error.message; // Podría ser más específico si se necesita
        }

        return NextResponse.json({ message: errorMessage }, { status: statusCode });
    }
    // 'finally' no es necesario si serverless-mysql maneja conexiones
}

