import ExportCountrywise from "../models/exportCountrywise.js"


//GET - year + month rows
export const getExportByYearMonth = async (req, res) => {

    try {
        const {year, month} = req.params

        if (!year || !month) return res.status(400).json ({
            message: "Year and Month required ..."
        })
        const rows = await ExportCountrywise.getByYearMonth (Number(year), month)
        if (!rows || rows.length ===  0) return res.status (404).json ({
            message: "No data found ..."
        })

        return res.status(200).json ({
            year: Number(year), month, rows
        })
    } 
    catch (error) {
        console.error ("Error fetching Export Countrywise by Year & Month :", error)
        return res.status(500).json ({
            message: "Internal server error ...",
            error:  error.message
        })
    }
}



// GET: aggregate  for a year across a list of months
export const getExportAggregate =  async (req, res) => {

    try {
        const {year} = req.query
        const months = req.query.months
        if (!year || !months) return res.status(400).json({
            message: "year and months required"
        })

        const monthsArray = Array.isArray(months) ? months : String(months). split(",").map(m => m.trim())
        const rows = await ExportCountrywise.getAggregateByYearAndMonths(Number(year), monthsArray)

        return res.status(200).json ({
            year: Number(year),
            months: monthsArray,
            rows
        })
    } 
    catch (error) {
        console.error ("Error fetching aggregated export :", error)
        return res.status(500).json ({
            message: "Internal server error ...",
            error: error.message
        })
    }
}



// GET : latest month rows
export const getLatestExport = async (req, res) => {
    try{
        const rows = await ExportCountrywise.getLatestMonth()
        if (!rows || rows.length === 0)
            return res.status(404).json ({
                message: "No data found ..."
            })
        return res.status(200).json ({
            rows
        })
    }
    catch (error) {
        console.error("Error fetching latest export :", error)
        return res.status(500).json ({
            message: "Internal server error ...",
            error: error.message
        })
    }  

}




// POST : Insert month data (bulk)
export const createExportMonth = async (req, res) => {
    try{
        const {year, month, entries} = req.body

        if (year == null || !month) {
            return res.status(400).json({
                message: "Year and Month required ..."
            })
        }
        if (!Array.isArray (entries) || entries.length === 0) {
            return res.status(400).json ({
                message: "entries (array) is required ..."
            })
        }

        const invalid = entries.find(e => !e.country || e.qty_kg == null)
        if (invalid) {
            return res.status(400).json({
                message: "each entry must include country and qty_kg ..."
            })
        }

        await ExportCountrywise.createMany (year, month, entries)

        return res.status(201).json ({
            message: "Export data inserted successfully ...",
            inserted: entries.length,
            year,
            month
        })
    }
    catch (error) {
        console.error ("Error Creating Export Month ....", error)
        return res.status(500).json({
            message: "Internal Server Error ...",
            error: error.message
        })
    }
}



// PUT: update one country entry for a year + month
export const updateCountryExport = async (req, res) => {
    
    try {
        const {year, month, country} =  req.params
        const {qty_kg} = req.body

        if (!year  || !month | !country) 
            return res.status(400).json ({
                message: "year, month, country are required ..."
            }) 
        
        if (qty_kg == null) return res.status(400).json ({
            message: "qty_kg is required in body ..."
        })

        const [result] = await ExportCountrywise.updateCountryQty(Number (year), month, country, qty_kg)

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "No record found to update ..."
            })
        }

        return res.status(200).json ({
            message: "Record updated", 
            affectedRows: result.affectedRows
        })

    }
    catch (error) {
        console.error("Error Updating Country Export ...", error)
        return res.status(500).json({
            message: "Internal Server Error ...",
            error: error.message
        })
    }
}



// DELETE : delete one country entry for a year +  month
export const deleteCountryExport =  async (req, res) => {
    
    try {
        const {year, month, country} = req.params

        if (!year || !month || !country) 
            return res.status(400).json({
                message: "year, month, country are required ..."
            })
        
        const [result] = await ExportCountrywise.deleteCountry(Number(year), month, country)

        if (result.affectedRows === 0) 
            return res.status(400).json({
                message: "No record found to delete ..."
            }) 

        return res.status(200).json({
            message: "Record deleted",
            affectedRows: result.affectedRows
        })
    }
    catch (error){
        console.error("Error Deleting Country Export ... ", error)
        return res.status(500).json ({
            message: "Internal Server Error ...",
            error: error.message
        })
    }
}



// DELETE: delete all rows for a year + month
export const deleteMonthExport = async (req, res) => {

    try {
        const {year, month} = req.params

        if (!year || !month) 
            return res.status(400).json({
                message: "Year and Month are required  ..."
            })

        const [result] = await ExportCountrywise.deleteByYearMonth(Number(year), month)
        
        if (result.affectedRows === 0) 
            return res.status(404).json({
                message: "No records found for that month ..."
        })

        return res.status(200).json ({
            message: "Month deleted successfully ...",
            deletedRows: result.affectedRows
        })
    }
    catch (error) {
        console.error ("Error Deleting Month Export ...", error)
        return res.status(500).json ({
            message: "Internal Server Error ...",
            error: error.message
        })
    }
}