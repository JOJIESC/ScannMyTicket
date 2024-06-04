import mysql from "serverless-mysql";
import { NextResponse } from "next/server";

const db = mysql({
  config: {
    host: "db-project.cv46koc6gsu5.us-east-1.rds.amazonaws.com",
    user: "admin",
    password: "bYAj1Ryi5qDUorTMUGT5",
    database: "db",
  },
});

export async function POST(req) {
  try {
    const userData = await req.json();
    console.log(userData);

    const {
      id,
      email_address,
      first_name,
      last_name,
      phone_number,
      birth_date,
      avatar,
    } = userData;

    const query = `
            UPDATE users 
            SET 
                email_address = ?, 
                first_name = ?, 
                last_name = ?, 
                phone_number = ?, 
                birth_date = ?, 
                avatar = ?
            WHERE id = ?
        `;

    const values = [
      email_address,
      first_name,
      last_name,
      phone_number,
      birth_date,
      avatar,
      id,
    ];

    // Aquí es donde hacemos la consulta a la base de datos
    const result = await db.query(query, values);
    await db.end(); // Cierra la conexión después de la consulta

    return NextResponse.json({
      message: "User updated successfully",
      result,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Error updating user",
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
