import {conn} from '@/libs/mysql';
import {NextResponse} from 'next/server';

export async function GET() {
    try {
        // trae a los organizadores de la base de datos
        const organizadores = await conn.query('SELECT * FROM users WHERE role = "organizer"');
        console.log(organizadores);
        return NextResponse.json(organizadores);
    } catch (error) {
        return NextResponse.json({
            message: "error listando organizadores"
        }, {
            status: 500
        })
    }
}