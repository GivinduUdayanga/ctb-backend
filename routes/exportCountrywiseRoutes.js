import express from "express"
import { 
    createExportMonth, 
    deleteCountryExport, 
    deleteMonthExport, 
    getExportAggregate, 
    getExportByYearMonth, 
    getLatestExport, 
    updateCountryExport 
} from "../controllers/exportCountrywiseController.js"


const router =  express.Router ()

router.get("/:year/:month", getExportByYearMonth)
router.get("/aggregate", getExportAggregate)
router.get("/latest", getLatestExport)
router.post("/", createExportMonth)
router.put("/:year/:month/:country", updateCountryExport)
router.delete("/:year/:month/:country", deleteCountryExport)
router.delete("/:year/:month", deleteMonthExport)


export default router