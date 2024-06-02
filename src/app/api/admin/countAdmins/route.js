import {conn} from '@/libs/mysql';
import {NextResponse} from 'next/server';

export async function GET() {
    try {
        // trae a los usuarios de la base de datos
        const NumAdmins = await conn.query('SELECT COUNT(*) as total_admins FROM users WHERE role = "admin"');
        console.log(NumAdmins);
        return NextResponse.json(NumAdmins);
    } catch (error) {
        return NextResponse.json({
            message: "error listando eventos"
        }, {
            status: 500
        })
    }
}