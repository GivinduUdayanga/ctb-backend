import {db} from "../db.js";

const MonthlyProduction = {
    // CREATE MULTIPLE RECORDS
    createMany(records) {
        const sql = `
            INSERT INTO monthly_production 
            (year, month, category, elevation, month_qty, ytd_qty)
            VALUES ?
        `;

        return db.query(sql, [records]);
    },

    // GET BY YEAR + MONTH
    getByYearMonth(year, month) {
        const sql = `
            SELECT * FROM monthly_production 
            WHERE year = ? AND month = ?
            ORDER BY category, elevation
        `;
        return db.execute(sql, [year, month]);
    },

    // GET LATEST MONTH
    getLatest() {
    const sql = `
        SELECT mp.*
        FROM monthly_production mp
        INNER JOIN (
            SELECT year, month
            FROM monthly_production
            ORDER BY year DESC,
                FIELD(month,
                    'January','February','March','April','May','June',
                    'July','August','September','October','November','December'
                ) DESC
            LIMIT 1
        ) AS latest
        ON mp.year = latest.year
        AND mp.month = latest.month
        ORDER BY mp.category, mp.elevation;
    `;
    return db.execute(sql);
    },


    

    updateMany(year, month, records) {
    const updates = records.map(record => {
        return db.query(
            `
            UPDATE monthly_production 
            SET month_qty = ?, ytd_qty = ?
            WHERE year = ? AND month = ? AND category = ? AND elevation = ?
            `,
            [
                record.month_qty,
                record.ytd_qty,
                year,
                month,
                record.category,
                record.elevation
            ]
        );
    });

    return Promise.all(updates);
    },




    // DELETE based on year + month
    deleteByYearMonth(year, month) {
    const sql = `
        DELETE FROM monthly_production
        WHERE year = ? AND month = ?
    `;
    return db.execute(sql, [year, month]);
    }
};

export default MonthlyProduction;
