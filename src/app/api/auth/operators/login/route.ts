// src/app/api/auth/operators/login/route.ts
import { NextResponse } from 'next/server';
import { conn } from '@/libs/mysql';
import { SignJWT } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  try {
    if (!JWT_SECRET) {
      return NextResponse.json({ message: 'JWT mal configurado' }, { status: 500 });
    }

    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ message: 'Faltan credenciales' }, { status: 400 });
    }

    const rows = await conn.query(
      'SELECT id, email_address, password FROM operators WHERE email_address = ?',
      [email],
    );

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ message: 'Operador no encontrado' }, { status: 401 });
    }

    const op = rows[0] as any;
    if (op.password !== password) {
      return NextResponse.json({ message: 'Credenciales inválidas' }, { status: 401 });
    }

    const payload = {
      user: {
        id: op.id,
        email_address: op.email_address,
        role: 'OPERATOR', // en mayúsculas como veníamos usando
      },
    };

    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('30d')
      .sign(new TextEncoder().encode(JWT_SECRET));

    const res = NextResponse.json({ ok: true, role: 'operator' }, { status: 200 });
    res.cookies.set('ScannToken', token, {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      secure: process.env.NODE_ENV === 'production',
    });
    return res;
  } catch (e) {
    console.error('operators/login error:', e);
    return NextResponse.json({ message: 'Error interno' }, { status: 500 });
  }
}
