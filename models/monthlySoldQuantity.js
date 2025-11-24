import {db} from "../db.js"

const MonthlySoldQuantity = {

    // Create main month header
    async createMonth (data) {
        const [result] = await db.query (
            `INSERT INTO monthly_sold_quantity (sale_year, sale_month)
            VALUES (?,?)`,
            [data.sale_year, data.sale_month]
        )
        return result.insertId
    },

    // Create many entries for a month
    async createEntries (monthId, entries) {
        const  values = entries.map (e => [
            monthId,
            e.category,
            e.qty_kgs,
            e.avg,
            e.usd_value
        ])

        await db.query (
            `INSERT INTO monthly_sold_quantity_entries
            (month_id, category, qty_kgs, avg, usd_value)
            VALUES ?`,
            [values]
        )
    },



    // GET by year & month
    async getByYearMonth (year, month) {
        const [rows] = await db.query (
            `SELECT * FROM monthly_sold_quantity
            WHERE sale_year = ? AND sale_month = ?`,
            [year, month]
        )
        return rows[0]
    },



    // GET entries by month_id
    async getEntries (monthId) {
        const [rows] = await db.query (
            `SELECT * FROM monthly_sold_quantity_entries
            WHERE month_id = ?`,
            [monthId]
        )
        return rows
    },


    // UPDATE month header
    async updateMonth (monthId, data) {
        await db.query (
            `UPDATE monthly_sold_quantity
            SET sale_year = ? AND sale_month = ?
            WHERE id = ?`,
            [data.sale_year, data.sale_month, monthId]
        )
        return rows
    },



    // Delete entries for month
    async deleteEntries (monthId) {
        await db.query (
            `DELETE FROM monthly_sold_quantity_entries
            WHERE month_id = ?`,
            [monthId]
        )
    },


    // DELETE the month header
    async deleteMonth (monthId) {
        await db.query (
            `DELETE FROM monthly_sold_quantity
            WHERE id = ?`,
            [monthId]
        )
    },



    // GET the latest two months
    async getLatestTwoMonths () {
        const [rows] = await db.query (
            `SELECT * FROM monthly_sold_quantity
            ORDER BY sale_year DESC, sale_month DESC
            LIMIT 2`
        )
        return rows
    }
}


export default MonthlySoldQuantity