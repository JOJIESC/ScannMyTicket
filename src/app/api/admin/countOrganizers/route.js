import {conn} from '@/libs/mysql';
import {NextResponse} from 'next/server';

export async function GET() {
    try {
        // trae a los usuarios de la base de datos
        const NumOrganizers = await conn.query('SELECT COUNT(*) as total_organizers FROM users WHERE role = "organizer"');
        return NextResponse.json(NumOrganizers);
    } catch (error) {
        return NextResponse.json({
            message: "error listando eventos"
        }, {
            status: 500
        })
    }
}