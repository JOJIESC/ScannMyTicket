import {conn} from '@/libs/mysql'
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { serialize } from 'cookie'

export async function POST(req, res) {
    try {
        const { email, password } = await req.json()
        console.log(email, password)
        const rows = await conn.query('SELECT * FROM operators WHERE email_address = ? AND password = ?', [email, password])
        const operatorExists = rows.find(operator => operator.email_address === email && operator.password === password)
        if(operatorExists){
            const token = jwt.sign({
                exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
                email: rows[0].email_address,
                password: rows[0].password,
                role: 'operator',
                id: rows[0].id
            }, 'secretkey')

            const serialized = serialize('ScannToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60 * 24 * 30,
                path: '/'
            })
            const response = NextResponse.json(
                {role: 'operator'},
                {status: 200}
            )
            response.headers.set('Set-Cookie', serialized);
            return response
        }
        }catch (error) {
        return NextResponse.error(error)
    }
}