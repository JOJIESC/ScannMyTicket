import { NextResponse } from "next/server";
import { conn } from '@/libs/mysql';
import jwt from 'jsonwebtoken';
import { serialize } from "cookie";

export async function GET() {
    try {
        // trae a los usuarios de la base de datos
        const usuarios = await conn.query('SELECT * FROM users');
        console.log(usuarios);
        return NextResponse.json(usuarios);
    } catch (error) {
        return NextResponse.json({
            message: "error listando eventos"
        }, {
            status: 500
        })
    }
}

export async function POST(req, res) {

    const { email, password } = await req.json();

    try {
        // trae a los usuarios de la base de datos
        const usuarios = await conn.query('SELECT * FROM users');
        try {
            // busca el usuario en la base de datos
            const usuario = usuarios.find(user => user.email_address === email && user.password === password);
           
            if (usuario) {  // si el usuario existe
                // crea el token
                const token = jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
                    email: usuario.email_address,
                    username: usuario.first_name,
                    first_name: usuario.first_name,
                    last_name: usuario.last_name,
                    role: usuario.role,
                    phone_number: usuario.phone_number,
                    birth_date: usuario.birth_date,
                    password: usuario.password,
                    id: usuario.id
                }, 'secretkey')

                // crea la cookie con el token
                const serialized = serialize('ScannToken', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 1000 * 60 * 60 * 24 * 30, //caducidad del token 30 dias
                    path: '/'
                })
 
                // retorna el cookie con el token en el header
                const response = NextResponse.json(
                    {role: usuario.role},
                    {status: 200}
                );
                response.headers.set('Set-Cookie', serialized);
                return response;
            }
        } catch (error) { // si el usuario no existe retorna un error
            return NextResponse.json({
                message: "no existe el usuario"
            }, {
                status: 500
            })
        }


    } catch (error) { // si no se pudo obtener los usuarios
        return NextResponse.json({
            message: "error obteniendo usuarios"
        }, {
            status: 500
        })
    }

    return NextResponse.json({ // si no se pudo procesar el inicio de sesion
        message: "error al procesar el inicio sesion"
    }, {
        status: 401
    })
}