import {conn} from '@/libs/mysql';
import {NextResponse} from 'next/server';

export async function POST(req) {
    try {
        const result = await conn.query('INSERT INTO suscriptions SET ?', {
            suscriptor_id : req.body.id
        });
        return NextResponse.json({
            message: "Suscripcion creada",
            id: result.insertId,
            email: req.body.email
        });
    } catch (error) {
        return NextResponse.json({
            message: "error creando suscripcion"
        }, {
            status: 500
        }
        )
    }
}