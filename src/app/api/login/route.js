import { NextResponse } from "next/server";
import { conn } from '@/libs/mysql';

export async function GET() {
    try {
        const results = await conn.query('SELECT * FROM events');
        return NextResponse.json(results);
    } catch (error) {
        return NextResponse.json({
            message: "error listando eventos"
        }, {
            status: 500
        })
    }

}


export async function POST(req) {
    return NextResponse.json('login success')
}