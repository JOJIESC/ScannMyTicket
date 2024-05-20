import mysql from 'serverless-mysql'

export const conn = mysql({
    config: {
        host: 'db-project.cv46koc6gsu5.us-east-1.rds.amazonaws.com',
        user: 'admin',
        password: 'bYAj1Ryi5qDUorTMUGT5',
        port: 3306,
        database: 'db'
    }
})