import {db} from "../db.js"

const weeklySalesAverage = {

    //GET by year & sale_code
    getByYearAndSaleCode: async (sale_year, sale_code) => {
        const sql = `
            SELECT * FROM weekly_sales_average 
            WHERE sale_year = ? AND sale_code = ?
            ORDER BY sale_week ASC
        `
        const [rows] = await db.execute (sql, [sale_year, sale_code])
        return rows
    },

    create: async (data) => {

        const sql = `
            INSERT INTO weekly_sales_average (
                sale_code, sale_year, sale_week,
                uva_high, western_high, total_high_grown,
                uva_medium, western_medium, total_medium_grown,
                total_low_grown,
                ctc_high, ctc_medium, ctc_low,
                orthodox_low,
                total
            )
            VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )
        `

        const values = [
            data.sale_code,
            data.sale_year,
            data.sale_week,
            data.uva_high,
            data.western_high,
            data.total_high_grown,
            data.uva_medium, 
            data.western_medium, 
            data.total_medium_grown,
            data.total_low_grown,
            data.ctc_high,
            data.ctc_medium, 
            data.ctc_low,
            data.orthodox_low,
            data.total
        ]

        return db.execute (sql, values)

    },



    update: async (sale_year, sale_code, data) => {
        const sql = `
            UPDATE weekly_sales_average SET
                uva_high = ?, western_high = ?, total_high_grown = ?,
                uva_medium = ?, western_medium = ?, total_medium_grown = ?,
                total_low_grown = ?, ctc_high = ?, ctc_medium = ?, ctc_low = ?,
                orthodox_low = ?, total = ?
            WHERE sale_year = ? AND sale_code = ?
        `

        const values = [
            data.uva_high ?? 0,
            data.western_high ?? 0,
            data.total_high_grown ?? 0,
            data.uva_medium ?? 0,
            data.western_medium ?? 0,
            data.total_medium_grown ?? 0,
            data.total_low_grown ?? 0,
            data.ctc_high ?? 0,
            data.ctc_medium ?? 0,
            data.ctc_low ?? 0,
            data.orthodox_low ?? 0,
            data.total ?? 0,
            sale_year,
            sale_code
        ]

        return db.execute(sql, values)
    },


    delete: async (sale_year, sale_code) => {
        const sql = `
            DELETE FROM weekly_sales_average
            WHERE sale_year = ? AND sale_code = ?
        `
        return db.execute(sql, [sale_year, sale_code])
    }

}

export default weeklySalesAverage