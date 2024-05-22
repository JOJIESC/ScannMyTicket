import { NextResponse } from "next/server"
import {verify} from 'jsonwebtoken'

export function GET(req,res) {
    const cookies = req.headers.get('cookie');
    const ScannToken = cookies?.split('; ').find(row => row.startsWith('ScannToken='))?.split('=')[1];


    if (!ScannToken) {
        return NextResponse.json({ message: 'No token provided' })
    }

    try {
        const user= verify(ScannToken, 'secretkey')
        return NextResponse.json({ email: user.email, username: user.username})
    } catch (err) {
        return NextResponse.json({ message: 'Invalid token' })
    }
}