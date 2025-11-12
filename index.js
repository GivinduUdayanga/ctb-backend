import express from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'
import colors from 'colors'
import connectDB from './db.js'


//configure dotenv
dotenv.config()

//rest object
const app = express()

//middlewares
app.use(express.json())
app.use(morgan("dev"))

//connect to MySQL before handling requests
const connection = await connectDB()

// Example route: get all users from database
app.get("/users", async (req, res)=>{
    try{
        const [rows] = await connection.execute("SELECT * FROM users")
        res.json(rows)
    }
    catch (error) {
        console.log("Error fetching data : ", error)
        res.status(500).send("Database error ...")
    }
})

//PORT
const PORT = process.env.PORT || 5000

//listen
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${process.env.PORT} ...`.bgMagenta.white)
})



