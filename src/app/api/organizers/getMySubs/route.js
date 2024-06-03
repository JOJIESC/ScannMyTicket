import { conn } from '@/libs/mysql';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { user_id } = await req.json()
        console.log(user_id);
        const query = `
        SELECT u.first_name, u.last_name, u.email_address, e.title, u.avatar
        FROM users AS u
        JOIN events AS e ON u.id = e.user_id
        JOIN subscriptions AS s ON e.id = s.subscribed_to
        WHERE e.user_id = ?;`;
        const [results] = await conn.query(query, [user_id]);
        console.log(results);
        return NextResponse.json([results]);
    } catch (error) {
        return NextResponse.json({
            message: "error obtuviendo suscriptores"
        }, {
            status: 500
        })
    }
}