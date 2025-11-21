import {db} from "../db.js"

//
//------ PARENT TABLE MODEL -------
//

export const WeeklySoldQuantity = {


    // Create week record
    async createWeek ({
        sale_year,
        sale_code
    }) 
    {
        const [result] = await db.query (
            `INSERT INTO weekly_sold_quantity (sale_year, sale_code)
             VALUES (?, ?)`,
            [sale_year, sale_code]
        )
        return result.insertId
    },


    // Fetch all weeks
    async getAll () {
        const [rows] = await db.query(
            `SELECT * FROM weekly_sold_quantity ORDER BY sale_year DESC, sale_code DESC`
        );
        return rows;
    },


    // Fetch week using (year + code)
    async getByYearAndCode (sale_year, sale_code) {
        const [rows] = await db.query(
            `SELECT * FROM weekly_sold_quantity WHERE sale_year = ? AND sale_code = ? LIMIT 1`,
            [sale_year, sale_code]
        );
        return rows[0];
    },


    // GET latest week
    async getLatestWeek () {
        const [rows] =  await db.query(
            `SELECT *
            FROM weekly_sold_quantity
            ORDER BY sale_year DESC, sale_code DESC
            LIMIT 1`
        )
        return rows[0]
    },
        

    // Update fields
    async updateWeekById (id, {sale_year, sale_code}) {
        return db.query (
            `UPDATE weekly_sold_quantity
             SET sale_year = ?, sale_code = ?
             WHERE id = ?`,
            [sale_year, sale_code, id]
        )
    },


    // Delete week (cascade deletes entries)
    async deleteByYearAndCode (sale_year, sale_code) {
        return db.query (
            `DELETE FROM weekly_sold_quantity
             WHERE sale_year = ? AND sale_code = ?`,
            [sale_year, sale_code]
        )
    }     
    
}



//
// ------- CHILD TABLE MODEL -------
//

export const WeeklySoldQuantityEntries = {

    
    // Insert multiple row entries
    async createMany (week_id, entries) {
        const values = entries.map(entry => [
            week_id, 
            entry.category, 
            entry.qty_kgs,
            entry.avg,
            entry.usd_value
        ]);
        return db.query (
            `INSERT INTO weekly_sold_quantity_entries 
            (week_id, category, qty_kgs, avg, usd_value)
             VALUES ?`,
            [values]
        )
    },


    // Fetch entries for specific week
    async getByWeekId (week_id) {

        const [rows] = await db.query(
            `SELECT * FROM weekly_sold_quantity_entries 
             WHERE week_id = ?`,
            [week_id]
        );
        return rows;
    },


    // Delete all entries for a week
    async deleteByWeeklyId (week_id) {
        return db.query (
            `DELETE FROM weekly_sold_quantity_entries
             WHERE week_id = ?`,
            [week_id]
        )
    }
}