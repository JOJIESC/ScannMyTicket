import { conn } from '@/libs/mysql'
import { NextResponse } from 'next/server'

export async function POST(req) {
    try {
        const { eventId } = await req.json(); // Asegúrate de que se extrae eventId correctamente
        const sql = `SELECT * FROM operators WHERE event_id = ?;`
        const rows = await conn.query(sql, [eventId])
        if (rows.length <= 0 || rows === undefined) {
            return NextResponse.json({ message: 'No operators found for this event' }, { status: 201 })
        }
        return NextResponse.json(rows)
    } catch (error) {
        return NextResponse.error(error)
    }
}

