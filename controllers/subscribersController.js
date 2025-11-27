import Subscribers from "../models/subscribers.js"
import {db} from "../db.js"

export const subscribe = async (req, res) => {
    try {
        const {email} = req.body

        if (!email)
            return res.status(400).json ({
                message: "Email is required ..."    
            })

        const existing = await Subscribers.findByEmail(email)

        if (existing && existing.is_active === 1) 
            return res.status(400).json ({
                message:  " This email is already subscribed ..."
            })

        if (existing && existing.is_active === 0) {
            await Subscribers.updateEmail(existing.id, email)
            return res.json ({
                message: "Email reactivated successfully ..."
            })
        }
        

        await Subscribers.create(email)

        res.json ({
            message: "Subscription Successfully ..."
        })
    }
    catch (error) {
        console.error ("Subscribe Error :" , error)
        res.status(500).json ({
            message: "Internal Server Error ...",
            error: error.message
        })
    }
}



// GET - subscribers
export const getActiveSubscribers = async (req, res) => {
    const subs = await Subscribers.getActive()
    res.json(subs)
}



// PUT - subscribe - update - /:id
export const updateEmail = async (req, res) => {

    try {
        const {id} = req.params
        const {newEmail} = req.body

        if (!newEmail)
            return res.status(400).json({
                message: "New email is required ..."
            })
        
        const exists = await Subscribers.findByEmail(newEmail)

        if (exists)
            return res.status(400).json ({
                message: "Email already exists ..."
            })

        await Subscribers.updateEmail(id, newEmail)
        res.json({
            message: "Email updated successfully ..."
        })
    }
    catch (error) {
        console.error ("Error updating subscriber :", error)
        return res.status(500).json  ({
            message: "Internal server error ...",
            error: error.message
        })
    }
}



// DELETE - unsubscribe 
export const unsubscribe = async (req, res) => {

    const {email} = req.body

    if (!email)
        return res.status(400).json({
            message: "Email is required ..."
        })
        
    try {    
        const [existing] = await db.query (
            `SELECT * FROM subscribers WHERE email = ?`,
            [email]
        )

        if (existing.length === 0)
            return res.status(404).json ({
                message: "Email not found ..."
            })

        await db.query ("DELETE FROM subscribers WHERE email = ?", [email])

        return res.json({
            message: "Unsubscribe successfully ..."
        })
        
    }
    catch (error) {
        console.error ("Error deleting unsubscribe ...", error)
        return res.status(500).json ({
            message: "Internal Server Error ...",
            error: error.message
        })
    }
}