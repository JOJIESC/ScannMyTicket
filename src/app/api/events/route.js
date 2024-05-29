import { NextResponse } from "next/server";
import { conn } from '@/libs/mysql';

export async function GET() {
    try {
        // trae a los eventos de la base de datos
        const results = await conn.query('SELECT * FROM events');

                // Formatea las fechas en los resultados
                const formattedResults = results.map(event => {
                    if (event.start) { 
                        const date = new Date(event.start);
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const day = String(date.getDate()).padStart(2, '0');
                        event.start = `${year}-${month}-${day}`;
                    }

                    if (event.end) { 
                        const date = new Date(event.end);
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const day = String(date.getDate()).padStart(2, '0');
                        event.end = `${year}-${month}-${day}`;
                    }
                    return event;
                });


        console.log(formattedResults);
        return NextResponse.json(results);
    } catch (error) { // si hay un error al traer los eventos
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
        const { title, description, image_url, user_id, start, end,startTime, endTime,location } = await req.json();

        //insertar evento en la base de datos con los valores esperados de entrada
        const result = await conn.query('INSERT INTO events SET ?', {
            title: title,
            description: description,
            image_url: image_url,
            user_id: user_id,
            start: start,
            end: end,
            startTime: startTime,
            endTime: endTime,
            location: location
        });

        console.log(result);
        //imprime el resultado y envia un next response con el resultado
        return NextResponse.json({
            id: result.insertId,
            title,
            description,
            image_url,
            user_id,
            start,
            end,
            startTime,
            endTime,
            location
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