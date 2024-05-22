import {verify} from 'jsonwebtoken';
import { serialize } from "cookie";
import { NextResponse } from 'next/server';

export function POST(req, res) {
    const cookies = req.headers.get('cookie');
    const ScannToken = cookies?.split('; ').find(row => row.startsWith('ScannToken='))?.split('=')[1];

    if (!ScannToken) {
        return NextResponse.json({ message: 'No token provided' },
            { status: 401 })

    }
    
    try {
        // establecemos el token existente a null, lo eliminamos
        verify(ScannToken, 'secretkey')
        const serialized = serialize('ScannToken', null, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 0,
            path: '/'
        })
        const response = NextResponse.json({ message: 'logout success' });
        response.headers.set('Set-Cookie', serialized);
        return response;
    } catch (error) {
        return NextResponse.json({ message: 'Invalid token' },
            { status: 401 })
    }

}