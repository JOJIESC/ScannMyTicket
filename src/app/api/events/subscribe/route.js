import { conn } from '@/libs/mysql';
import { NextResponse } from 'next/server';

export async function POST(req, res) {
    const subscription = await req.json();
    try {
        const alreadyExists = await conn.query('SELECT * FROM subscriptions WHERE subscriber_id = ? AND subscribed_to = ?',
            [subscription.userID, subscription.eventID]);

        if (alreadyExists.length > 0) {
            console.log("Ya esta suscrito a este evento")
            return NextResponse.json({
                message: "Ya esta suscrito a este evento"
            }, {
                status: 201
            });
        } else {
            const expirationDate = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30); // expira en 30 días

            const result = await conn.query('INSERT INTO subscriptions SET ?', {
                subscriber_id: subscription.userID,
                subscribed_to: subscription.eventID,
                // created_at se definen automaticamente en la base de datos
                expires_at: expirationDate
            });
            return NextResponse.json({
                message: "Suscripcion creada",
                id: result.insertId,
                subscription_id: subscription.userID,
                subscription_to: subscription.eventID
            });
        }

    } catch (error) {

        return NextResponse.json({
            message: "error creando suscripcion"
        }, {
            status: 500
        });
    }
}