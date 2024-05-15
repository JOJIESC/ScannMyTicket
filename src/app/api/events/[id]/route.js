import { NextResponse } from "next/server";
//conn es la conexion a la base de datos
import { conn } from '@/libs/mysql';

export async function GET(req, { params }) {

    try {
        console.log(params.id);
        //selecciona el evento con el id que se pasa como parametro
        const result = await conn.query('SELECT * FROM events WHERE id = ?', [params.id]);
        //si no se encuentra el evento (el arreglo de los eventos esta vacío) se retorna un message: 404
        if (result.length === 0) {
            return NextResponse.json({
                message: "Evento no encontrado"
            }, {
                status: 404
            });
        }
        return NextResponse.json(result[0]);
    } catch (error) {
        return NextResponse.json({
            message: "error obteniendo evento"
        }, {
            status: 500
        })
    }

}

//PUT es lo mismo que update
export async function PUT(req, { params }) {
try {
    
    const data = await req.json();
    const result = await conn.query('UPDATE events SET ? WHERE id = ?', [data, params.id]);
    if (result.affectedRows === 0) {
        return NextResponse.json({
            message: "Evento no encontrado"
        }, {
            status: 404
        });
    }
    return NextResponse.json({
        message: "Evento actualizado",
        ...data
    });
} catch (error) {
    return NextResponse.json({
        message: "error actualizando evento"
    }, {
        status: 500
    })
}

}

export async function DELETE(req, { params }) {
    try {
        const result = await conn.query('DELETE FROM events WHERE id = ?', [params.id]);
        if (result.affectedRows === 0) {
            return NextResponse.json({
                message: "Evento no encontrado"
            }, {
                status: 404
            });
        }
        return NextResponse.json({
            message: "Evento eliminado"
        });
    } catch (error) {
        return NextResponse.json({
            message: "error eliminando evento"
        }, {
            status: 500
        })
    }
}