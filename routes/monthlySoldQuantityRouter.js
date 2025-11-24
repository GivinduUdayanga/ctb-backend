import express from "express"
import { 
    createMonthlySold, 
    deleteMonthlySold, 
    getLatestTwoMonths, 
    getMonthlySold, 
    updateMonthlySold
 } from "../controllers/monthlySoldQuantityController.js"

const router = express.Router ()

router.get("/:year/:month", getMonthlySold)
router.get("/latest", getLatestTwoMonths)
router.post("/", createMonthlySold)
router.put("/:year/:month", updateMonthlySold)
router.delete("/:year/:month", deleteMonthlySold)

export default router