import { NextResponse } from "next/server";
import { conn } from '@/libs/mysql';

export async function GET() {
    try {
        const results = await conn.query('SELECT * FROM events');
        return NextResponse.json(results);
    } catch (error) {
        return NextResponse.json({
            message: "error listando eventos"
        }, {
            status: 500
        })
    }

}

export async function POST(req) {
    try {

        //espera estos valores de entrada
        const { title, description, image_url, user_id, start, end } = await req.json();

        //formatear fecha
        //ejemplo de formato de fecha: 2024-05-13T10:00:00 [YYYY-MM-DDTHH:MM:SS]
        const formattedStart = new Date(start).toISOString().slice(0, 19).replace('T', ' ');
        const formattedEnd = new Date(end).toISOString().slice(0, 19).replace('T', ' ');

        //insertar evento en la base de datos con los valores esperados de entrada
        const result = await conn.query('INSERT INTO events SET ?', {
            title: title,
            description: description,
            image_url: image_url,
            user_id: user_id,
            start: formattedStart,
            end: formattedEnd
        });

        //imprime el resultado y envia un next response con el resultado
        return NextResponse.json({
            id: result.insertId,
            title,
            description,
            image_url,
            user_id,
            start,
            end,
        });


    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message: "error creando evento"
        }, {
            status: 500
        }
        )

    }

}