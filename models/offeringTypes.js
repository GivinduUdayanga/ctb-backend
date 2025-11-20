import {db}  from "../db.js"

const OfferingTypes = {
    getAll: async () => {
        const sql = `SELECT id, name FROM sales_offering_types ORDER BY id `
        const [rows] = await db.execute(sql)
        return rows
    },

    create: async (name) => {
        const sql = `INSERT INTO sales_offering_types (name) VALUES (?)`
        const [result] = await db.execute(sql, [name])
        return result
    }
} 

export default OfferingTypes