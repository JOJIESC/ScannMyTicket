import {conn} from '@/libs/mysql';
import {NextResponse} from 'next/server';

export async function GET() {
    try {
        // trae a los usuarios de la base de datos
        const usuarios = await conn.query('SELECT * FROM users WHERE role = "user"');
        console.log(usuarios);
        return NextResponse.json(usuarios);
    } catch (error) {
        return NextResponse.json({
            message: "error listando usuarios"
        }, {
            status: 500
        })
    }
}