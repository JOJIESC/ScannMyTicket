import {conn} from '@/libs/mysql'
import { NextResponse } from 'next/server'

export async function POST(req){

    const {id} = await req.json() 
    if(id === undefined){
        return NextResponse.json(
            { message: 'Peticion invalida' },
            { status: 400 }
        );
    }
    const query = `DELETE FROM subscriptions WHERE id = ?`
    try {
        await conn.query(query, [id])
        return NextResponse.json({status: 200, message: 'Subscripcion eliminada'})
    } catch (error) {
        return NextResponse.json({status: 500},{message: 'Internal server error'})
    }

}