import { NextResponse } from "next/server";
import { conn } from '@/libs/mysql';
import jwt from 'jsonwebtoken';
import { serialize } from "cookie";

export async function GET() {
    try {
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
        const usuarios = await conn.query('SELECT * FROM users');
        console.log(usuarios);

        try {
            const usuario = usuarios.find(user => user.email_address === email && user.password === password);
            // check if email and password are correct
            if (usuario) {
                const token = jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
                    email: usuario.email_address,
                    username: usuario.first_name
                }, 'secretkey')

                const serialized = serialize('ScannToken', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 1000 * 60 * 60 * 24 * 30, //caducidad del token 30 dias
                    path: '/'
                })

                const response = NextResponse.json({ message: 'login success' });
                response.headers.set('Set-Cookie', serialized);
                return response;
            }
        } catch (error) {
            return NextResponse.json({
                message: "no existe el usuario"
            }, {
                status: 500
            })
        }

    } catch (error) {
        return NextResponse.json({
            message: "error obteniendo usuarios"
        }, {
            status: 500
        })
    }

    return NextResponse.json({
        message: "error al procesar el inicio sesion"
    }, {
        status: 401
    })
}