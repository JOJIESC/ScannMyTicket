import {conn} from '@/libs/mysql'
import { NextResponse } from 'next/server'

export async function POST(req){
    try {        
        const {id} = await req.json()
        console.log(id)
        const query = `SELECT * FROM subscriptions WHERE id = ?`
        const [rows] = await conn.query(query, [id])
        console.log(rows)
        if(rows !== undefined && rows.length > 0){
            return NextResponse.json({status: 200, message: 'Subscription found', data: rows[0]})
        }else{
            return NextResponse.json({status: 202, message: 'Subscription not found'})
        }
    } catch (error) {
        return NextResponse.json({status: 500, message: 'Internal server error'})
    }

}

export function DELETE(req){

}

