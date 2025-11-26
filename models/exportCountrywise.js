import {db} from "../db.js"

const ExportCountrywise = {


    // GET all rows  for a year + month 
    getByYearMonth : async (year, month) => {

        const sql = `
            SELECT id, year, month, country, qty_kg
            FROM export_countrywise
            WHERE year = ? AND month = ?
            ORDER BY qty_kg DESC
        `
        const [rows] = await db.execute(sql, [year, month])
        return rows
    },


    // GET aggregated totals across a year range / month 
    getAggregateByYearAndMonths: async (year, monthsArray) => {
        
        const sql =  `
            SELECT country, SUM(qty_kg) AS total_qty
            FROM export_countrywise
            WHERE year = ? AND month IN (?)
            GROUP BY country
            ORDER BY total_qty DESC
        `
        const [rows] = await db.query(sql, [year, monthsArray])
        return rows
    },


    //GET latest month 
    getLatestMonth: async () => {

        const sqlLatest = `
            SELECT year, month
            FROM export_countrywise
            ORDER BY year DESC, created_at DESC
            LIMIT 1
        `
        const [latest] = await db.execute(sqlLatest)
        if (!latest || latest.length === 0) return []
        const {year, month} = latest[0]
        return ExportCountrywise.getByYearMonth (year, month)
    },


    // Bulk insert many country rows for a given year + month
    createMany: async (year, month, entries) => {

        if (!Array.isArray(entries) || entries.length === 0) return
        const sql =`
            INSERT INTO export_countrywise (year, month, country, qty_kg)
            VALUES ?
        `
        const values = entries.map(e => [year, month, e.country, e.qty_kg])
        return db.query(sql, [values])
    },


    // UPDATE one country row identified by year + month + country
    updateCountryQty: async (year, month, country, qty_kg) => {
        const sql = `
            UPDATE export_countrywise
            SET qty_kg = ?
            WHERE year = ? AND month = ? AND country = ?
        `
        return db.execute(sql, [qty_kg, year, month, country])
    },

    
    // DELETE one country row by year + month + country
    deleteCountry : async (year, month, country) => {

        const sql = `
            DELETE FROM export_countrywise
            WHERE year = ? AND month = ? AND country = ?
        `
        return db.execute(sql, [year, month, country])
    },


    //DELETE all rows for a particular year + month
    deleteByYearMonth : async (year, month) => {

        const sql = `
            DELETE FROM export_countrywise
            WHERE year = ? AND month = ?
        `
        return db.execute(sql, [year, month])
    }

}

export default ExportCountrywise