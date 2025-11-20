import WeeklySales from "../models/weeklySales.js"
import WeeklySalesEntries from "../models/weeklySalesEntries.js"
import {db} from "../db.js"

export const getLatestTwoWeeks = async (req, res) => {
    try {
        const weeks = await WeeklySales.getLatestTwoWeeks()

        if (!weeks || weeks.length === 0) {
            return res.status (400).json ({
                message: "No weekly sales found"
            })
        }

        const resultWeeks = []
        for (const w of weeks) {
            const entries = await WeeklySalesEntries.getByWeekId (w.id)
            const mapped = entries.map(e => ({
                offering_id: e.offering_type_id,
                offering_name: e.offering_name,
                lots: e.lots,
                qty: e.qty
            }))
            resultWeeks.push({
                id: w.id,
                sale_year: w.sale_code,
                sale_week_start: w.sale_week_start,
                sale_week_end: w.sale_week_end,
                entries: mapped
            })
        }

        return res.status(200).json({weeks: resultWeeks})
    }
    catch (error) {
        console.error("Error fetching latest two weeks : ", error)
        return res.status(500).json({
            message: "Internal server error", 
            error: error.message
        })
    }
}




export  const createWeeklySales = async (req, res) => {

    const body = req.body

    try{
        const required = ["sale_year", "sale_code", "sale_week_start", "sale_week_end","entries"]
        const missing = required.filter(f => body[f] === undefined)
        if (missing.length) {
            return res.status(400).json({
                message: "Missing required fields", fields: missing
            })
        }
        if (!Array.isArray(body.entries) || body.entries.length === 0) {
            return res.status(400).json({
                message: "entries must be a non-empty array"
            })
        }

        await db.beginTransaction()

        const weekId = await WeeklySales.createWeek ({
            sale_year: body.sale_year,
            sale_code: body.sale_code,
            sale_week_start: body.sale_week_start,
            sale_week_end: body.sale_week_end
        })

        await WeeklySalesEntries.createMany (weekId, body.entries)

        await db.commit()

        return res.status(201).json({
            message: "Weekly sales created", weekId
        })
    } 
    catch (error) {
        try {
            await db.rollback()
        } 
        catch (e) {

        }
        console.error("Error creating weekly sales:", error)
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
}


export const updateWeeklySales = async (req, res) => {

    try {
        const {sale_year, sale_code} = req.params
        const body = req.body

        if (!sale_year || !sale_code) {
            return res.status(400).json({
                message: "sale_year and sale_code are required ..."
            })
        }

        const week = await WeeklySales.getByYearAndCode(Number(sale_year), sale_code)
        
        if (!week) {
            return res.status(404).json ({
                message: "Week not found for given year & code ..."
            })
        }

        await db.beginTransaction()

        if (body.sale_week_start || body.sale_week_end) {
            await WeeklySales.updateWeekById (week.id, {
                sale_week_start: body.sale_week_start ?? week.sale_week_start,
                sale_week_end: body.sale_week_end ?? week.sale_week_end
            })
        }

        if (Array.isArray(body.entries)) {
            await WeeklySalesEntries.deleteByWeeklyId(week.id)
            if (body.entries.length > 0) {
                await WeeklySalesEntries.createMany(week.id, body.entries)
            }
        }

        await db.commit()
        return res.status(200).json({
            message: "Weekly sales updated ..."
        })
        
    }
    catch (error) {
        try {
            await db.rollback()
        }
        catch {}
        console.error("Error updating weekly sales : ", error)
        return res.status(500).json ({
            message: "Internal server error",
            error: error.message
        })
    }
}



export const deleteWeeklySales = async (req, res) => {

    try{
        const {sale_year, sale_code} = req.params
        if (!sale_year || !sale_code) {
            return res.status(400).json({
                message: "sale_year and sale_code are required"
            })
        }

        const [result] = await WeeklySales.deleteByYearAndCode(Number(sale_year), sale_code)

        if (result.affectedRows === 0) {
            return res.status(400).json({
                message: "No week found to delete"
            })
        }

        return res.status(200).json({
            message: "Weekly sales deleted ... "
        })
    }
    catch (error) {
        console.error("Error deleting weekly sales : ", error)
        return res.status(500).json({
            message: "Internal server error",
            error: error,massage
        })
    }
}