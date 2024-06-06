import { conn } from '@/libs/mysql'
import { NextResponse } from 'next/server'

export async function POST(req, res) {
    try {
        const  {operator_email}  = await req.json()
        console.log(operator_email)
        const query = `
                SELECT events.*
                FROM events
                JOIN operators ON events.id = operators.event_id
                WHERE operators.email_address = ?`
        const rows = await conn.query(query, [operator_email])
        console.log(rows)
        return NextResponse.json(rows, { status: 200 })
    } catch (error) {
        return NextResponse.error({ message: error.message }, { status: 201 })
    }
}