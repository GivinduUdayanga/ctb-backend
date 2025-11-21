import express from 'express';
import { 
    createWeeklySold, 
    deleteWeeklySold, 
    getAllWeeksSold, 
    getLatestWeekSold, 
    updateWeeklySold 
} from '../controllers/weeklySoldQuantityController.js';

const router = express.Router()

router.get("/", getAllWeeksSold);
router.get("/latest", getLatestWeekSold)
router.post("/", createWeeklySold)
router.put("/:sale_year/:sale_code", updateWeeklySold)
router.delete("/:sale_year/:sale_code", deleteWeeklySold)


export default router