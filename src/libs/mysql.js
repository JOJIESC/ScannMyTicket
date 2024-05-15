import mysql from 'serverless-mysql'

export const conn = mysql({
    config: {
        host: 'localhost',
        user: 'root',
        password: 'admin',
        port: 3306,
        database: 'db'
    }
})