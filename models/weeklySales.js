import {db} from "../db.js"

const WeeklySales = {
    createWeek: async (data) => {
        const sql = `
            INSERT INTO weekly_sales
            (sale_year, sale_code, sale_week_start, sale_week_end)
            VALUES (?, ?, ?, ?)
        `
        const [result] = await db.execute(sql, [
            data.sale_year,
            data.sale_code,
            data.sale_week_start,
            data.sale_week_end
        ])

        return result.insertId
    },


    getByYearAndCode: async (sale_year, sale_code) => {
        const sql = `
            SELECT *
            FROM weekly_sales 
            WHERE sale_year = ? AND sale_code = ?
            LIMIT 1
        `
        const [rows] = await db.execute(sql, [sale_year, sale_code])
        return rows.length ? rows[0] : null
    },


    updateWeekById: async (weekId, data) => {
        const sql = `
            UPDATE weekly_sales
            SET sale_week_start = ?, sale_week_end = ? 
            WHERE id = ?
        `

        return db.execute (sql, [
            data.sale_week_start, 
            data.sale_week_end, 
            weekId
        ])
    },


    deleteByYearAndCode: async (sale_year, sale_code) => {
        const sql = `DELETE FROM weekly_sales WHERE sale_year = ? AND sale_code = ?`
        return db.execute(sql, [sale_year, sale_code])
    }
}


export default WeeklySales