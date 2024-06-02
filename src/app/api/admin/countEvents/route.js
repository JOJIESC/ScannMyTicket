import {conn} from '@/libs/mysql';
import {NextResponse} from 'next/server';

export async function GET() {
    try {
        // trae a los usuarios de la base de datos
        const NumEventos = await conn.query('SELECT COUNT(*) as total_events FROM events');
        console.log(NumEventos);
        return NextResponse.json(NumEventos);
    } catch (error) {
        return NextResponse.json({
            message: "error listando eventos"
        }, {
            status: 500
        })
    }
}