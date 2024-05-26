import { NextResponse } from "next/server"
import {verify} from 'jsonwebtoken'

// Tomamos los datos del usuario desde el token almacenado en las cookies
export function GET(req,res) {
    // obtenemos las cookies del header
    const cookies = req.headers.get('cookie');
    // buscamos la cookie ScannToken con el token
    const ScannToken = cookies?.split('; ').find(row => row.startsWith('ScannToken='))?.split('=')[1];


    if (!ScannToken) { // si no hay token
        return NextResponse.json({ message: 'No token provided' })
    }

    try {
        //verificar token
        const user= verify(ScannToken, 'secretkey')
        //retornar datos del usuario
        return NextResponse.json({ 
            email_address: user.email, 
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role,
            phone_number: user.phone_number,
            birth_date: user.birth_date,
            password: user.password,
            Id: user.id
        })
    } catch (err) { // si el token es inválido
        return NextResponse.json({ message: 'Invalid token' })
    }
}
