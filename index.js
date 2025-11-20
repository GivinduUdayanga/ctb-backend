import express from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'
import colors from 'colors'
import connectDB from './db.js'
import {db} from './db.js'
import weeklySalesAverageRouter from './routes/weeklySalesAverageRouter.js'
import weeklySalesRouter from "./routes/weeklySalesRouter.js"
import offeringTypesRouter from "./routes/offeringTypesRouter.js"

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

app.use('/api/weeklySalesAverage', weeklySalesAverageRouter)
app.use("/api/weeklySales", weeklySalesRouter)
app.use("/api/offeringTypes", offeringTypesRouter)



//PORT
const PORT = process.env.PORT || 5000
//listen
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${process.env.PORT} ...`.bgMagenta.white)
})