import express from "express"

import {
    getWeeklySalesByYearAndSaleCode,
    createWeeklySalesRecord,
    updateWeeklySalesRecord,
    deleteWeeklySalesRecord
} from "../controllers/weeklySalesAverageController.js"



const router = express.Router()



// GET
router.get("/", getWeeklySalesByYearAndSaleCode)

// POST
router.post("/", createWeeklySalesRecord)

// PUT
router.put("/", updateWeeklySalesRecord)

// DELETE
router.delete("/", deleteWeeklySalesRecord)


export default router