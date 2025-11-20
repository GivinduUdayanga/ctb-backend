import {db} from "../db.js"

const WeeklySalesEntries = {
    
    createMany: async (weekId, entries) => {
        if (!entries || entries.length === 0) return
        const sql = `
            INSERT INTO  weekly_sales_entries
            (week_id, offering_type_id, lots, qty)
            VALUES ${entries.map (() => "(?, ?, ?, ?)").join(",")}
        `
        const values = []
        entries.forEach (e => {
            values.push (weekId, e.offering_type_id, e.lots ?? 0, e.qty ?? 0)
        })
        return db.execute (sql, values)

    },


    deleteByWeeklyId: async (weekId) => {
        const sql = `DELETE FROM weekly_sales_entries WHERE week_id = ?`
        return db.execute (sql, [weekId])
    },


    getByWeekId: async (weekId) => {
        const sql = `
            SELECT  e.id, e.lots, e.qty, e.offering_type_id, t.name AS offering_name
            FROM weekly_sales_entries e
            JOIN sales_offering_types t ON e.offering_type_id = t.id
            WHERE e.week_id = ?
            ORDER BY t.id
        `
        const [rows] = await db.execute(sql, [weekId])
        return rows
    }
}


export default WeeklySalesEntries