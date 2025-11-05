import { conn } from '@/libs/mysql';
import { NextResponse } from 'next/server';

export async function PUT(req) {
  try {
    const { id, title, description, start, startTime, end, endTime, location } = await req.json();
    const result = await conn.query(
      'UPDATE events SET title=?, description=?, start=?, startTime=?, end=?, endTime=?, location=? WHERE id=?',
      [title, description, start, startTime, end, endTime, location, id]
    );
    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
