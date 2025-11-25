import express from "express"
import { 
    addMonthlyProduction, 
    deleteMonthlyProduction, 
    getLatestMonthlyProduction, 
    getMonthlyProductionByYearMonth, 
    updateMonthlyProduction 
} from "../controllers/monthlyProductionController.js"



const router = express.Router()


router.get("/:year/:month", getMonthlyProductionByYearMonth)
router.get("/latest", getLatestMonthlyProduction)
router.post("/", addMonthlyProduction)
router.put("/:year/:month", updateMonthlyProduction )
router.delete("/:year/:month", deleteMonthlyProduction)


export default router
