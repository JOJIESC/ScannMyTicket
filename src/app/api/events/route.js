import { NextResponse } from "next/server";
import { conn } from '@/libs/mysql';
import {v2 as cloudinary} from 'cloudinary';
import { writeFile } from "fs/promises";
import path from "path";

cloudinary.config({ 
    cloud_name: 'drvje3oru', 
    api_key: '195154275267958', 
    api_secret: 'aQueAtCtvLQunZmY7zaYble55NU' 
  });

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

        const data = await req.formData();
        const image = data.get('image');
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filePath = path.join(process.cwd(), 'public', 'img', 'events', image.name);
        await writeFile(filePath, buffer);
        const image_url = await cloudinary.uploader.upload(filePath)
        const result = await conn.query('INSERT INTO events SET ?', {
            title: data.get('title'),
            description: data.get('description'),
            image_url: image_url.secure_url,
            user_id: data.get('user_id'),
            start: data.get('startDate'),
            end: data.get('endDate'),
            startTime: data.get('startTime'),
            endTime: data.get('endTime'),
            location: data.get('location'),
        });
        console.log(result);
        const event_id = result.insertId;

        return NextResponse.json({
            message: "evento creado",
            event_id: event_id
        },
        {
            status: 201
        }
        );

        // console.log(data.get('startDate'));
        // console.log(data.get('endDate'));
        // console.log(data.get('title'));
        // console.log(data.get('description'));
        // console.log(data.get('location'));
        // console.log(data.get('image'));
        // console.log(data.get('user_id'))

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