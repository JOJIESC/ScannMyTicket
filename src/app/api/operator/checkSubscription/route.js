import {conn} from '@/libs/mysql'
import { NextResponse } from 'next/server'

export async function POST(req){
    try {        
        const {email,subscriber_id,subscribed_to} = await req.json()
        console.log(email,subscriber_id,subscribed_to)
        if(email === undefined || subscriber_id === undefined || subscribed_to === undefined){
            return NextResponse.json(
                { message: 'Peticion invalida' },
                { status: 400 }
            );
        }
        const query = `SELECT s.*
                        FROM subscriptions s
                        JOIN events e ON s.subscribed_to = e.id
                        JOIN operators o ON e.id = o.event_id
                        WHERE s.subscriber_id = ?
                        AND s.subscribed_to = ?
                        AND o.email_address = ?;
                        `
        const rows = await conn.query(query, [subscriber_id,subscribed_to,email])
        console.log(rows)
        if(rows.length > 0){
            return NextResponse.json({status: 200, message: 'Subscripcion encontrada', data: rows[0]})
        }else{
            return NextResponse.json({status: 404},{message: 'Subscripcion no encontrada'})
        }
    } catch (error) {
        return NextResponse.json({status: 500},{message: 'Internal server error'})
    }

}
