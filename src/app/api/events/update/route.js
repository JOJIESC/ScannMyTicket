import { conn } from '@/libs/mysql';
import { NextResponse } from 'next/server';

export async function PUT(req) {
    try {
        const { id, title, description, start, startTime, end, endTime, location } = await req.json();
        console.log(id, title);

        // Realizamos la consulta SQL para actualizar el evento
        const result = await conn.query('UPDATE events SET title = ?, description = ?, start = ? ,startTime = ? ,end = ? ,endTime = ? , location = ? WHERE id = ?', [title, description, start, startTime, end, endTime, location, id]);

        // Devolvemos una respuesta con el resultado y el código de estado HTTP 200 OK
        return NextResponse.json(
            {
                result: result
            },
            {
                status: 200
            }
        );
    } catch (error) {
        // En caso de error, devolvemos una respuesta con un mensaje de error y el código de estado HTTP 500 Internal Server Error
        return NextResponse.error({ message: error.message }, 500);
    }
}
