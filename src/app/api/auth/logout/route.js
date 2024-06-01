import {verify} from 'jsonwebtoken';
import { serialize } from "cookie";
import { NextResponse } from 'next/server';

export function POST(req, res) {
    // obtenemos las cookies del header
    const cookies = req.headers.get('cookie');
    // buscamos la cookie ScannToken con el token
    const ScannToken = cookies?.split('; ').find(row => row.startsWith('ScannToken='))?.split('=')[1];

    if (!ScannToken) { // si no hay token
        return NextResponse.json({ message: 'No token provided' },
            { status: 401 })
    }
    
    try {
        // establecemos el token existente a null, lo eliminamos
        verify(ScannToken, 'secretkey')
        // creamos la cookie con el token null para cerrar sesión
        const serialized = serialize('ScannToken', null, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 0,
            path: '/'
        })
        // retornamos la cookie con el token null en el header
        const response = NextResponse.json({ message: 'logout success' });
        response.headers.set('Set-Cookie', serialized);
        return response;
    } catch (error) { // si el token es inválido
        return NextResponse.json({ message: 'Invalid token' },
            { status: 401 })
    }

}