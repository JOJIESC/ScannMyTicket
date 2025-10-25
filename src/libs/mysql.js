import mysql from 'serverless-mysql'

export const conn = mysql({
    config: {
        host: 'scannticket.czgw0i4kuhkp.us-east-2.rds.amazonaws.com',
        user: 'admin',
        password: 'scann-password',
        port: 3306,
        database: 'scannticket'
    }
})