import express from "express"
import {listOfferingTypes} from "../controllers/offeringTypesController.js"


const router = express.Router()

router.get("/", listOfferingTypes)

export default router