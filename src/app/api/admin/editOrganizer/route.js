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

    const {
      id,
      email_address,
      first_name,
      last_name,
      phone_number,
      birth_date,
      avatar,
      password,
    } = userData;

    const query = `
            UPDATE users 
            SET 
                email_address = ?, 
                first_name = ?, 
                last_name = ?, 
                phone_number = ?, 
                birth_date = ?, 
                avatar = ?,
                password = ?
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
      password,
    ];

    const result = await db.query(query, values);
    await db.end();

    return NextResponse.json({
      message: "Organizer updated successfully",
      result,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Error updating Organizer",
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
