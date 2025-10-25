import mysql from 'serverless-mysql';

// Lee las credenciales de las variables de entorno de forma segura
export const conn = mysql({
    config: {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        port: 3306, // Puerto estándar de MySQL
        database: process.env.MYSQL_DATABASE
    },
    // Opciones recomendadas para serverless-mysql
});
