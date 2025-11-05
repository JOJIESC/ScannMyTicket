import { conn } from '@/libs/mysql';
import { NextResponse } from 'next/server';
import { serialize } from 'cookie';
import { SignJWT } from 'jose';

export async function POST(req) {
  try {
    const body = await req.json();
    const id = typeof body === 'object' && body !== null ? (body.id ?? body) : body;
    if (!id) {
      return NextResponse.json({ message: "Falta id" }, { status: 400 });
    }

    const result = await conn.query('SELECT * FROM users WHERE id = ? ', [id]);
    const usuario = Array.isArray(result) ? result[0] : result;
    if (!usuario || !usuario.id) {
      return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return NextResponse.json({ message: "Error de configuración del servidor" }, { status: 500 });
    }

    const key = new TextEncoder().encode(secret);

    const token = await new SignJWT({
      user: {
        id: usuario.id,
        email_address: usuario.email_address,
        first_name: usuario.first_name,
        last_name: usuario.last_name,
        role: usuario.role,
        avatar: usuario.avatar,
        birth_date: usuario.birth_date,
        phone_number: usuario.phone_number
      }
    })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(key);

    const serialized = serialize('ScannToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });

    const response = NextResponse.json({ ok: true }, { status: 200 });
    response.headers.set('Set-Cookie', serialized);
    return response;

  } catch (error) {
    console.error("error actualizando el token:", error);
    return NextResponse.json({ message: "error actualizando el token" }, { status: 500 });
  }
}
