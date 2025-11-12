import mysql from 'mysql2/promise'
import colors from 'colors'


async function connectDB() {
    try{
        const connection = await mysql.createConnection({
            host: "localhost",      
            user: "root",           
            password: "Givindu@17", 
            database: "ctb_db"
        })
        console.log("Connected to MySQL Database ...".bgCyan.white)
        return connection
    }
    catch (error) {
        console.log("Error connecting to MySQL : ", error.message)
        process.exit(1)
    }
    
}

export default connectDB

