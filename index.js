import express from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'
import colors from 'colors'
import connectDB from './db.js'
import {db} from './db.js'
import awaitingSalesOfferingRouter from './routes/awaitingSalesOfferingRouter.js'



//configure dotenv
dotenv.config()


//rest object
const app = express()
//middlewares
app.use(express.json())
app.use(morgan("dev"))


//connect to MySQL before handling requests
await connectDB()



//Routes
app.use('/api/awaitingSalesOffering', awaitingSalesOfferingRouter)


//PORT
const PORT = process.env.PORT || 5000
//listen
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${process.env.PORT} ...`.bgMagenta.white)
})


