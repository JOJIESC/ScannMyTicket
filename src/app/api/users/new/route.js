import { NextResponse } from "next/server";
import { conn } from '@/libs/mysql';

export async function POST(req,res) {
    try {

        //espera estos valores de entrada
        const { email_address,first_name,last_name,phone_number,password,birth_date,avatar } = await req.json();

        //insertar evento en la base de datos con los valores esperados de entrada
        const result = await conn.query('INSERT INTO users SET ?', {
            email_address: email_address,
            first_name: first_name,
            last_name: last_name,
            phone_number: phone_number,
            password: password,
            birth_date: birth_date,
            avatar: avatar,
            role: 'user'
        });

        //imprime el resultado y envia un next params con el resultado
        console.log(result);
        return NextResponse.json({
            id: result.insertId,
            email_address,
            first_name,
            last_name,
            phone_number,
            password,
            birth_date,
            avatar
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




