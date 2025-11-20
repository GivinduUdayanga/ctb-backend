import express from "express"
import {
    getLatestTwoWeeks,
    createWeeklySales,
    updateWeeklySales,
    deleteWeeklySales
} from "../controllers/weeklySalesController.js"

const router = express.Router()

//GET latest two weeks
router.get("/latest", getLatestTwoWeeks)

//POST create week + entries
router.post("/", createWeeklySales)

//PUT update by url params
router.put("/:sale_year/:sale_code", updateWeeklySales)

// DELETE by URL params
router.delete("/:sale_year/:sale_code", deleteWeeklySales)

export default router