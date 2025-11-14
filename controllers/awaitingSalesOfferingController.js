import { getAllAwaitingSalesOfferings, createAwaitingSalesOffering } from "../models/awaitingSalesOffering.js"
import {db} from "../db.js"

export const getAwaitingSalesOfferings = async (req, res) => {
    try {
        const data = await getAllAwaitingSalesOfferings();
        res.json(data)
    }
    catch (error){
        console.error("Error fetching data : " , error)
        res.status(500).send("Error fetchig data from database ... 🙁")
    }
}

export const addAwaitingSalesOffering = async (req, res) => {
    
    try{
        const result = await createAwaitingSalesOffering(req.body);
        res.status(201).json({ message: "Data inserted successfully", result })
    }
    catch (error) {
        console.error("Error Inserting data : ", error)
        res.status(500).send("Error inserting data into database ... 🙁")
    }
}
