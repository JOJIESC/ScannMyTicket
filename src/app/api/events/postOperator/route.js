import {conn} from '@/libs/mysql';
import {NextResponse} from 'next/server';

export async function POST(req) {
    try {
        const operatorsData = await req.json();
        // Iterar sobre cada operador y realizar la inserción en la base de datos
        for (const operator of operatorsData) {
            const result = await conn.query('INSERT INTO operators SET ?', {
                email_address: operator.email,
                password: operator.password,
                event_id: operator.event_id
            });
        }

        return NextResponse.json({
            message: 'Operadores insertados correctamente'
        });
    } catch (error) {
        return NextResponse.json({
            message: 'error listando operadores'
        }, {
            status: 500
        });
    }
}