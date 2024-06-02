import {conn} from '@/libs/mysql';
import {NextResponse} from 'next/server';
import {serialize} from 'cookie';
import jwt from 'jsonwebtoken';

export async function POST(req,res) {
    // crea el token
    try {
        // trae a los usuarios de la base de datos
        const id = await req.json();
        console.log(id);
        try {
            // busca el usuario en la base de datos
            const usuario = await conn.query('SELECT * FROM users WHERE id = ? ', [id]);
            console.log(usuario);

            console.log(usuario.length)
           
            if (usuario.length > 0) {  // si el usuario existe
                // crea el token con la informacion del usuario de la base de datos
                const token = jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
                    email: usuario[0].email_address,
                    username: usuario[0].first_name,
                    first_name: usuario[0].first_name,
                    last_name: usuario[0].last_name,
                    role: usuario[0].role,
                    phone_number: usuario[0].phone_number,
                    birth_date: usuario[0].birth_date,
                    password: usuario[0].password,
                    id: usuario[0].id,
                    avatar: usuario[0].avatar
                }, 'secretkey')

                // crea la cookie con el token
                const serialized = serialize('ScannToken', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 1000 * 60 * 60 * 24 * 30, //caducidad del token 30 dias
                    path: '/'
                })
 
                // retorna el cookie con el token en el header
                const response = NextResponse.json(
                    {role: usuario.role},
                    {status: 200}
                );
                response.headers.set('Set-Cookie', serialized);
                return response;
            }
        } catch (error) { // si el usuario no existe retorna un error
            return NextResponse.json({
                message: "no existe el usuario"
            }, {
                status: 500
            })
        }
    } catch (error) { // si no se pudo obtener los usuarios
        return NextResponse.json({
            message: "error actualizando el token"
        }, {
            status: 500
        })
    }

    return NextResponse.json({ // si no se pudo procesar el inicio de sesion
        message: "error al procesar la actualizacion del token"
    }, {
        status: 500
    })
}