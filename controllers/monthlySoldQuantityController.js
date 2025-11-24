import MonthlySoldQuantity from "../models/monthlySoldQuantity.js"
import {db} from "../db.js"


export const createMonthlySold = async (req, res) => {
    const body = req.body

    try {
        const required = ["sale_year", "sale_month", "entries"]
        const missing = required.filter(f => body[f] === undefined)

        if (missing.length > 0) {
            return res.status(400).json ({
                message: "Missing  required fields",
                fields:  missing
            })
        }

        if (!Array.isArray (body.entries) || body.entries.length === 0) {
            return res.status(400).json ({
                message:  "Entries must be a non-empty array"
            })
        }

        await db.beginTransaction()

        const monthId = await MonthlySoldQuantity.createMonth ({
            sale_year: body.sale_year,
            sale_month: body.sale_month
        })


        await MonthlySoldQuantity.createEntries (monthId, body.entries)

        await db.commit()

        return res.status(201).json ({
            message: "Monthly sold quantity created successfully ...",
            monthId 
        })
    } 
    catch (error) {
        await db.rollback()
        console.error ("Error creating monthly sold :", error)
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
}



export const getMonthlySold = async (req, res) => {

    try {
        const {year, month } = req.params

        const monthData = await MonthlySoldQuantity.getByYearMonth (year, month)

        if (!monthData) {
            return res.status(404).json ({
                message: "No data found for given year/month"
            })
        }

        const entries = await MonthlySoldQuantity.getEntries (monthData.id)

        return res.status(200).json ({
            month: monthData,
            entries 
        })
    } 
    catch (error) {
        console.error("Error fetching monthly sold :", error)
        return res.status(500).json ({
            message: "Internal server error",
            error: error.message
        })
    }
}




export const updateMonthlySold = async (req, res) => {

    try{
        const {year, month} = req.params
        const body = req.body

        const existing = await MonthlySoldQuantity.getByYearMonth (year, month)

        if (!existing) {
            return res.status(404).json ({
                message: "Month not found ..."
            })
        }

        await db.beginTransaction()

        if (body.sale_year || body.sale_month) {
            await MonthlySoldQuantity.updateMonth (existing.id, {
                sale_year: body.sale_year ?? year,
                sale_month: body.sale_month ?? month
            })
        }

        if (Array.isArray (body.entries)) {
            await MonthlySoldQuantity.deleteEntries (existing.id)
            if (body.entries.length > 0) {
                await MonthlySoldQuantity.createEntries (existing.id, body.entries)
            }
        }

        await db.commit ()

        return res.status(200).json ({
            message: "Monthly sold updated successfully ..."
        })

    } 
    catch (error) {
        await db.rollback()
        console.error("Error updating monthly sold :", error)
        return res.status(500).json ({
            message: "Internal Server Error",
            error: error.message
        })
    }
}


export const deleteMonthlySold = async (req, res) => {
    try{

        const {year, month} = req.params
        const existing = await MonthlySoldQuantity.getByYearMonth (year, month)

        if (!existing) {
            return res.status(404).json ({
                message: "Month not found ..."
            })
        }

        await MonthlySoldQuantity.deleteMonth (existing.id)

        return res.status(200).json ({
            message: "Monthly sold deleted successfully ..."
        })
    } 
    catch (error) {

        console.error ("Error deleting monthly sold : ", error)

        return res.status(500).json ({
            message: "Internal server error",
            error: error.message
        })
    }
}


export const getLatestTwoMonths = async (req, res) => {
    try {
        const months = await MonthlySoldQuantity.getLatestTwoMonths()

        if (!months || months.length === 0) {
            return res.status(404).json ({
                message: "No months found ..."
            })
        }

        const result = []

        for (const m of months) {
            const entries = await MonthlySoldQuantity.getEntries  (m.id)
            result.push ({
                month: m,
                entries
            })
        }

        return res.status(200).json ({
            latest : result
        })
        
    } 
    catch (error) {
        console.error (" Error fetching latest two months : ", error)
        return res.status(500).json ({
            message: "Internal server error ...",
            error: error.message
        })
    }
}