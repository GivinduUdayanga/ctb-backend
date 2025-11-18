import weeklySalesAverage from "../models/weeklySalesAverage.js"

// ====== GET -> Weekly Record by year & sale_code ======

export const getWeeklySalesByYearAndSaleCode = async (req, res) => {
    
    try {
        const {sale_year, sale_code} = req.query

        if (!sale_year || !sale_code) {
            return res.status(400).json ({
                message: "sale_year and sale_code are required ... "
            })
        }


        const rows = await weeklySalesAverage.getByYearAndSaleCode(sale_year, sale_code)

        if (rows.length === 0) {
            return res.status (404).json ({
                message: "No weekly sales records found for this year & sale code ... "
            })
        }

        return res.status (200).json ({
            message: "Weekly sales fetched successfully ... ",
            data: rows 
        })
    }
    catch (error) {
        console.error("Error fetching weekly sales : ", error)
        return res.status(500).json ({
            message: "Internal  server error ... ", 
            error : error.message
        })
    }

}



// ====== POST -> add new weekly record ======


export const createWeeklySalesRecord = async (req, res) => {

    try {
        const data = req.body

        const requiredFields = [
            "sale_code",
            "sale_year",
            "sale_week",
            "uva_high",
            "western_high",
            "total_high_grown",
            "uva_medium",
            "western_medium",
            "total_medium_grown",
            "total_low_grown",
            "ctc_high",
            "ctc_medium",
            "ctc_low",
            "orthodox_low",
            "total"
        ]

        const missingFields = requiredFields.filter(field => data[field] === undefined)

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: "Missing required fields ... ", fields: missingFields
            })
        }

        await weeklySalesAverage.create(data)

        res.status(201).json({
            message: "Weekly sales record created successfully ... "
        })
    } 

    catch (error) {
        console.error("Error creating weekly sales record : ", error)
        res.status(500).json ({
            message: "Internal server error ...", error: error.message
        }) 
    }

}



// ====== PUT -> update weekly record by sale year and sale code ======


export const updateWeeklySalesRecord = async (req, res) => {

    try {
        const {sale_year, sale_code} =  req.query
        const data = req.body

        if (!sale_year || !sale_code) {
            return res.status(400).json ({
                message: "sale_year and sale_code are required for update ..."
            })
        }

        const [result] = await weeklySalesAverage.update(sale_year, sale_code, data)
        
        if (result.affectedRows === 0) {
            return res.status(404).json ({
                message: "No record found to update for this year & sale code ..."
            })
        }

        res.status(200).json ({
            message: "Weekly sale record updated seccessfully ...."
        })
    } 
    
    catch (error) {
        console.error("Error updating weekly sales record : ", error)
        res.status(500).json ({
            message: "Internal server error ...", 
            error: error.message
        })
    }
}



// ====== DDELETE -> delete weekly record by sale year & sale code ======


export const deleteWeeklySalesRecord = async (req, res) => {
    
    try{
        const {sale_year, sale_code} = req.query

        if (!sale_year || !sale_code) {
            return res.status(400).json ({
                message: "sale_year and sale_code are required for deletion ..."
            })
        }

        const [result] = await weeklySalesAverage.delete(sale_year, sale_code)

        if (result.affectedRows === 0) {
            return res.status(400).json({
                message: "No record found to delete for this year & sale code ..."
            })
        }

        res.status(200).json({
            message: "Weekly sales record deleted successfully ..."
        })
    }
    
    catch (error) {
        console.error("Error deleting weekly sales record : ", error)
        res.status(500).json ({
            message: "Internal server error ...", 
            error: error.message
        })
    }
}