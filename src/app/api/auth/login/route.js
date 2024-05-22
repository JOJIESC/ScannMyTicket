import { NextResponse } from "next/server";
import { conn } from '@/libs/mysql';
import jwt from 'jsonwebtoken';
import { serialize } from "cookie";

export async function POST(req,res) {
    const { email, password } = await req.json();
    // check if email and password are provided

    // check if email is exist

    // check if email and password are correct
    if(email === 'joji@local.local' && password === '123456') {
        const token = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
            email: 'joji@local.local',
            username: 'admin'

            },'secretkey')

            const serialized = serialize('ScannToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60 * 24 * 30,
                path: '/'
            })
        
            const response = NextResponse.json({ message: 'login success' });
            response.headers.set('Set-Cookie', serialized);
            return response;
        }

    return NextResponse.json({
        message: "error al iniciar sesion"
    }, {
        status: 401
    })
}