// Ruta: src/app/api/auth/PROFILE/route.js
import { NextResponse } from "next/server";
import { jwtVerify } from "jose"; // CORRECCIÓN: Usar jose

// CORRECCIÓN: Lee la clave secreta desde las variables de entorno
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    // Es crucial detener la aplicación si la clave no está definida
    console.error('ERROR FATAL: La variable de entorno JWT_SECRET no está definida en /api/auth/PROFILE.');
    process.exit(1); // Detiene el proceso si falta la clave
}
// Convierte la clave a Uint8Array una sola vez
const secretKeyUint8Array = new TextEncoder().encode(JWT_SECRET);


export async function GET(req, res) {
    // 1. Obtenemos la cookie del header de la petición
    const tokenCookie = req.cookies.get('ScannToken');
    const token = tokenCookie?.value;

    if (!token) {
        // No hay token, devuelve error 401 Unauthorized
        return NextResponse.json({ message: 'No se proporcionó token de autenticación' }, { status: 401 });
    }

    try {
        // 2. Verificamos el token con 'jose' y la clave correcta
        const { payload } = await jwtVerify(token, secretKeyUint8Array);

        // 3. Verificamos la estructura del payload (debe coincidir con la creada en login)
        if (typeof payload.user !== 'object' || !payload.user.id) {
             console.error("Token inválido - estructura de payload 'user' incorrecta:", payload);
             throw new Error("Token inválido - estructura de payload 'user' incorrecta.");
        }
        
        // 4. Retornamos los datos del usuario que el frontend espera
        // Mapeamos los campos del token (payload.user) a los que esperan los componentes del frontend
        const userProfile = {
            id: payload.user.id,
            email_address: payload.user.email_address, // Asegúrate que 'email_address' esté en el token
            username: payload.user.first_name, // El frontend usa 'username'
            first_name: payload.user.first_name,
            last_name: payload.user.last_name,
            role: payload.user.role,
            avatar: payload.user.avatar,
            birth_date: payload.user.birth_date, // Añadido para Account page
            phone_number: payload.user.phone_number // Añadido para Account page
            // ¡NUNCA devolver la contraseña aquí!
        };

        return NextResponse.json(userProfile, { status: 200 });

    } catch (err) {
        // Captura errores específicos de jose (TokenExpiredError, JWTClaimValidationFailed, etc.)
        console.error("Error al verificar token en PROFILE:", err.code || err.message);
        let message = 'Token inválido o expirado';
        if (err.code === 'ERR_JWT_EXPIRED') {
            message = 'La sesión ha expirado, por favor inicia sesión de nuevo.';
        } else if (err.code === 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED') {
            message = 'Firma del token inválida.';
        }
        // Borramos la cookie inválida antes de responder
        const response = NextResponse.json({ message: message }, { status: 401 });
        response.cookies.set('ScannToken', '', { maxAge: -1, path: '/' }); // Borra la cookie
        return response;
    }
}