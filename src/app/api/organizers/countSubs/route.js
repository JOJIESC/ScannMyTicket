import {conn} from '@/libs/mysql';
import {NextResponse} from 'next/server';

export async function POST(req) {
    try {
        const {user_id} =await req.json();
        console.log(user_id);
        if (!user_id) {
            return NextResponse.json({
                message: "user_id no proporcionado"
            }, {
                status: 400
            });
        }
        console.log(user_id);
        const query = `
        SELECT COUNT(subscriptions.id) AS total_subscriptions
        FROM subscriptions
        INNER JOIN events ON subscriptions.subscribed_to = events.id
        WHERE events.user_id = ?;        
        `;
        const [results] = await conn.query(query, [user_id]);
        console.log(results);
        return NextResponse.json(results);
    } catch (error) {
        return NextResponse.json({
            message: "error contando suscriptores"
        }, {
            status: 500
        })
    }
}