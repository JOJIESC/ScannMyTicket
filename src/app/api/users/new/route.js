import { NextResponse } from "next/server";
import { conn } from '@/libs/mysql';

export async function POST(req) {
    try {

        //espera estos valores de entrada
        const { email_address,first_name,last_name,phone_number,password } = await req.json();

        //insertar evento en la base de datos con los valores esperados de entrada
        const result = await conn.query('INSERT INTO users SET ?', {
            email_address: email_address,
            first_name: first_name,
            last_name: last_name,
            phone_number: phone_number,
            password: password
        });

        //imprime el resultado y envia un next response con el resultado
        console.log(result);
        return NextResponse.json({
            id: result.insertId,
            email_address,
            first_name,
            last_name,
            phone_number,
            password,
        });


    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message: "error creando usuario"
        }, {
            status: 500
        }
        )

    }

}