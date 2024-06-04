import { conn } from "@/libs/mysql";
import { NextResponse } from "next/server";


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
