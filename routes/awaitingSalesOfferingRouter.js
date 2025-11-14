import express from "express"
import { 
    getAwaitingSalesOfferings, 
    addAwaitingSalesOffering 
} from "../controllers/awaitingSalesOfferingController.js"

const router = express.Router()

// GET all records
router.get("/", getAwaitingSalesOfferings)
//POST new record
router.post("/", addAwaitingSalesOffering)

export default router