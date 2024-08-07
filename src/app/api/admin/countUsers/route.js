import {conn} from '@/libs/mysql';
import {NextResponse} from 'next/server';

export async function GET() {
    try {
        // trae a los usuarios de la base de datos
        const NumUsuarios = await conn.query('SELECT COUNT(*) as total_users FROM users WHERE role = "user"');
        return NextResponse.json(NumUsuarios);
    } catch (error) {
        return NextResponse.json({
            message: "error listando eventos"
        }, {
            status: 500
        })
    }
}