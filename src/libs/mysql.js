import mysql from 'serverless-mysql';

// Lee las credenciales de las variables de entorno de forma segura
export const conn = mysql({
    config: {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD, // Lee la contraseña correcta
        port: 3306,
        database: process.env.MYSQL_DATABASE
    },
    // Opciones recomendadas para serverless-mysql
    onError: (e) => { console.error("Error de conexión a la BD:", e.message); }
});

