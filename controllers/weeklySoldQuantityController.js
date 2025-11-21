import {db} from "../db.js";
import {
    WeeklySoldQuantity,
    WeeklySoldQuantityEntries
} from "../models/weeklySoldQuantity.js";


//
//------ GET all weeks -------
//

export const getAllWeeksSold = async (req, res) => {
    try {
        const weeks = await WeeklySoldQuantity.getAll()

        const response = []

        for  (const week of weeks) {
            const entries =  await WeeklySoldQuantityEntries.getByWeekId (week.id)

            response.push ({
                id: week.id,
                sale_year: week.sale_year,
                sale_code: week.sale_code,
                created_at: week.created_at,
                entries: entries
            })
        }

        return res.status(200).json({
            weeks: response
        })
    } 
    catch (error) {
        console.error("Error fetching weekly sold : ", error)
        return res.status(500).json ({
            message: "Internal server error",
            error: error.message
        })
    }
}



//
// -------- GET LATEST WEEK SOLD --------
//


export const getLatestWeekSold = async (req, res) => {
    try {
        const week = await WeeklySoldQuantity.getLatestWeek()
        
        if (!week) {
            return res.status(404).json ({
                message: "No weekly sold records found"
            })
        }

        const entries = await WeeklySoldQuantityEntries.getByWeekId (week.id)

        return res.status(200).json ({
            id: week.id,
            sale_year: week.sale_year,
            sale_code: week.sale_code,
            created_at: week.created_at,
            entries 
        })
    } 
    
    catch (error) {
        console.error("Error fetching latest weekly sold : ", error)
        return res.status(500).json ({
            message: "Internal server error",
            error: error.message
        })
    }
}


//
// ------- CREATE week +  entries
//

export const createWeeklySold =  async (req, res) =>{

    const body =  req.body

    try{
        const required = ["sale_year", "sale_code", "entries"]
        const missing = required.filter (f => body[f] === undefined) 

        if (missing.length) {
            return res.status (400).json({
                message: "Missing required fields",
                fields: missing
            })
        }

        if (!Array.isArray (body.entries) || body.entries.length ===  0) {
            return res.status(400).json ({
                message:  "Entries must be a non-empty array"
            })
        }

        await db.beginTransaction ()

        const weekId = await WeeklySoldQuantity.createWeek ({
            sale_year: body.sale_year,
            sale_code: body.sale_code
        })

        await WeeklySoldQuantityEntries.createMany( weekId, body.entries)

        await db.commit()

        return res.status(201).json ({
            message: "weekly sold quantity created",
            weekId 
        })
    } 
    catch (error) {
        console.error("Error creating weekly sold :", error)
        return res.status(500).json ({
            message: "Internal server error",
            error: error.message
        })
    }
}



//
// --------- UPDATE week + entries ----------
//

export const updateWeeklySold = async (req, res) => {
    try {
        const { sale_year, sale_code} = req.params
        const body = req.body

        const week = await WeeklySoldQuantity.getByYearAndCode(sale_year, sale_code)

        if (!week) {
            return res.status(404).json ({
                message: "Week not found"
            })
        }

        await db.beginTransaction()

        if (body.sale_year || body.sale_code) {
            await WeeklySoldQuantity.updateWeekById (week.id, {
                sale_year: body.sale_year ?? week.sale_year,
                sale_code: body.sale_code ?? week.sale_code
            })
        }

        if (Array.isArray (body.entries)) {
            await WeeklySoldQuantityEntries.deleteByWeeklyId (week.id)

            if(body.entries.length > 0 ) {
                await WeeklySoldQuantityEntries.createMany (week.id, body.entries)
            }
        }

        await db.commit ()

        return res.status (200).json ({
            message: "Weekly sold  quantity updated successfully ..."
        })
    } 
    catch (error) {
        await db.rollback()
        console.error ("Error updating weeklt sold :", error)
        return res.status(500).json ({
            message: "Internal server error",
            error: error.message 
        })
    }
}



//
// -------- DELETE week ----------
//

export const deleteWeeklySold = async (req, res) => {

    try{
        const {sale_year, sale_code} = req.params 

        const [result] = await WeeklySoldQuantity.deleteByYearAndCode (
            sale_year,
            sale_code
        )

        if  (result.affectedRows === 0) {
            return res.status (400).json ({
                message: "No week found to delete"
            })
        }
        return res.status (200).json ({
            message: "Weekly sold quantity deleted successfully ..."
        })
    } 
    catch (error) {
        console.error ("Error deleting weekly sold : ", error)
        return res.status(500).json({
            message:  "Internal server error",
            error:error.message
        })
    }
}