import { NextResponse } from "next/server";
import { conn } from '@/libs/mysql';

export async function PUT(req,res) {
    try {
    
            //espera estos valores de entrada
            const { email_address,first_name,last_name,phone_number,password,birth_date,Id } = await req.json();
    
            //actualizar evento en la base de datos con los valores esperados de entrada
            const result = await conn.query('UPDATE users SET ? WHERE id = ?', [{
                email_address: email_address,
                first_name: first_name,
                last_name: last_name,
                phone_number: phone_number,
                password: password,
                birth_date: birth_date
            }, Id]);

            //imprime el resultado y envia un next params con el resultado
            console.log(result);
            return NextResponse.json({
                id: Id,
                email_address,
                first_name,
                last_name,
                phone_number,
                password,
                birth_date
            });
    } catch (error) {
        return NextResponse.json({
            message: "error actualizando usuario"
        }, {
            status: 500
        }
        )
    }
}