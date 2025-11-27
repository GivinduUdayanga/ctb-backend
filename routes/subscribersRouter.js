import express from "express"
import { 
    getActiveSubscribers,
    subscribe,
    unsubscribe,
    updateEmail, 
    
} from "../controllers/subscribersController.js"



const router = express.Router()


router.post("/subscribe", subscribe)
router.get("/subscribers", getActiveSubscribers )
router.put("/update/:id", updateEmail)
router.delete("/unsubscribe", unsubscribe )



export default router