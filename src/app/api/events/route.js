import { NextResponse } from "next/server";
import { conn } from '@/libs/mysql';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    const results = await conn.query('SELECT * FROM events');

    const formatted = results.map((e) => {
      const fmt = (d) => {
        if (!d) return d;
        const date = new Date(d);
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
      };
      return { ...e, start: fmt(e.start), end: fmt(e.end) };
    });

    return NextResponse.json(formatted);
  } catch (error) {
    return NextResponse.json({ message: "error listando eventos" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.formData();
    const image = data.get('image');

    let image_url = null;
    if (image && typeof image === 'object' && 'arrayBuffer' in image) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      image_url = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({}, (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }).end(buffer);
      });
    }

    const result = await conn.query('INSERT INTO events SET ?', {
      title:       data.get('title'),
      description: data.get('description'),
      image_url:   image_url?.secure_url || null,
      user_id:     data.get('user_id'),
      start:       data.get('startDate'),
      end:         data.get('endDate'),
      startTime:   data.get('startTime'),
      endTime:     data.get('endTime'),
      location:    data.get('location'),
    });

    return NextResponse.json(
      { message: "evento creado", event_id: result.insertId },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "error creando evento" }, { status: 500 });
  }
}
