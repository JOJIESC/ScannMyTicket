import { NextResponse } from "next/server";
import { conn } from '@/libs/mysql';

export async function PUT(req,res) {
    try {
        const {id,role}  = await req.json();
        if (role === 'organizer') {
            return NextResponse.json({ message: 'El usuario ya es organizador. Rediriginedo...'});
        }
        if(role === 'admin'){
            return NextResponse.json({ message: 'No puedes cambiar el rol de un administrador'});
        }
        if(role === 'operator'){
            return NextResponse.json({ message: 'No puedes cambiar el rol de un operador, crea una nueva cuenta para crear un evento'});
        }
        const result = await conn.query('UPDATE users SET ? WHERE id = ?', [{
            role: 'organizer'
        }, id]);
        return NextResponse.json({message: 'usuario actualizado exitosamente'}, {status: 200});
    } catch (error) {
        return NextResponse.json({ message: 'no se pudo actualizar el rol de usuario' });
    }
}