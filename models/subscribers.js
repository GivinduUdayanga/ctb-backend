import {db} from "../db.js"

const Subscribers = {

    //POST : Create new subscriber
    create: async (email) => {
        const sql = `
            INSERT INTO subscribers (email)
            VALUES (?)
        `
        return db.execute(sql, [email])
    },


    // GET active emails
    getActive: async () => {
        const sql =  `
            SELECT id, email, created_at
            FROM subscribers 
            WHERE is_active = 1
        `
        const [rows] = await db.execute(sql)
        return rows
    },



    //Check if email already exists
    findByEmail: async (email) => {
        const sql = `
            SELECT * FROM subscribers 
            WHERE email = ?
        `

        const [rows] = await db.execute(sql, [email])
        return rows[0]
    },



    // Update email  address
    updateEmail: async (id, newEmail) => {
        const sql = `
            UPDATE subscribers
            SET email = ?
            WHERE id = ?
        `
        return db.execute(sql, [newEmail, id])
    },


    // Delete or deactivate subscriber
    deactivate: async (email) => {
        const sql = `
            UPDATE subscribers
            SET is_active = 0
            WHERE email = ?
        `
        return db.execute (sql, [email])
    },



    // Optionnal : permanetly delete a subscriber
    remove : async () => {
        const sql = `
             DELETE FROM subscribers
             WHERE email = ?
        `
        return db.execute(sql, [email])
    }
}


export default Subscribers