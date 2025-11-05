import { NextResponse } from "next/server";
import { conn } from '@/libs/mysql';

export async function PUT(req) {
  try {
    const payload = await req.json();
    const { id } = payload || {};

    if (!id) {
      return NextResponse.json({ message: "Falta id de usuario" }, { status: 400 });
    }

    const update = {};

    // Campos simples
    for (const k of ['email_address', 'first_name', 'last_name', 'phone_number', 'avatar']) {
      if (Object.prototype.hasOwnProperty.call(payload, k)) {
        const v = payload[k];
        update[k] = v === '' ? null : v;
      }
    }

    // Fecha
    if (Object.prototype.hasOwnProperty.call(payload, 'birth_date')) {
      const v = payload.birth_date;
      update.birth_date = v ? new Date(v).toISOString().split('T')[0] : null;
    }

    // Contraseña (solo si se envía y no está vacía)
    if (Object.prototype.hasOwnProperty.call(payload, 'password')) {
      if (payload.password) {
        // **Compatibilidad con versión funcional**: texto plano
        update.password = payload.password;
      }
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ message: "Nada que actualizar" }, { status: 200 });
    }

    await conn.query('UPDATE users SET ? WHERE id = ?', [update, id]);
    return NextResponse.json({ ok: true }, { status: 200 });

  } catch (error) {
    console.error("error actualizando usuario:", error);
    return NextResponse.json({ message: "error actualizando usuario" }, { status: 500 });
  }
}
