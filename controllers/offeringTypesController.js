import OfferingTypes from "../models/offeringTypes.js"

export const listOfferingTypes = async (req, res) => {

    try{
        const rows = await OfferingTypes.getAll()
        return res.status(200).json({
            offeringTypes: rows
        })
    }
    catch (error) {
        console.error("Error listing offering types : ", error)
        return res.status(500).json ({
            message: "Intenal server error", 
            error: error.message
        })
    }
}