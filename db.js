import mysql from 'mysql2/promise'
import colors from 'colors'

let db 

export default async function connectDB() {
    try{
        db = await mysql.createConnection({
            host: "localhost",      
            user: "root",           
            password: "Givindu@17", 
            database: "ctb_db",
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        })
        console.log("Connected to MySQL Database ...".bgCyan.white)
        return db
    }
    catch (error) {
        console.error("Error connecting to MySQL : ", error.message)
        process.exit(1)
    }
    
}


export {db}

