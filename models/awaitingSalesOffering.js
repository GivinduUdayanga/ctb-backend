import {db} from "../db.js"

//Fetch all records
export const getAllAwaitingSalesOfferings = async () => {
    const [rows] = await db.execute("SELECT * FROM awaiting_sales_offering")
    return rows
}

//Insert a new record
export async function createAwaitingSalesOffering(data) {
    

    const sql = `
        INSERT INTO awaiting_sales_offering(
            start_Sale_Date,        end_Sale_Date,
            exEstate_Lots,          exEstate_Qty,
            high_Medium_Lots,       highMedium_Qty,
            lowGrown_L_Lots,        lowGrown_L_Qty,
            semiLeafy_Lots,         semiLeafy_Qty,
            lowGrown_S_Lots,        lowGrown_S_Qty,
            premiumFlowery_Lots,    premiumFlowery_Qty,
            offGrades_Lots,         offGrades_Qty,
            bop1a_Lots,             bop1a_Qty,
            dusts_Lots,             dusts_Qty,
            grandTotal_Lots,        grandTotal_Qty
        )
        VALUES(
            STR_TO_DATE(?, '%d %b %Y'), STR_TO_DATE(?, '%d %b %Y'),
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
    `

    const values = [
        data.start_Sale_Date,        
        data.end_Sale_Date,
        data.exEstate_Lots,          
        data.exEstate_Qty,
        data.high_Medium_Lots,       
        data.highMedium_Qty,
        data.lowGrown_L_Lots,        
        data.lowGrown_L_Qty,
        data.semiLeafy_Lots,         
        data.semiLeafy_Qty,
        data.lowGrown_S_Lots,        
        data.lowGrown_S_Qty,
        data.premiumFlowery_Lots,    
        data.premiumFlowery_Qty,
        data.offGrades_Lots,         
        data.offGrades_Qty,
        data.bop1a_Lots,             
        data.bop1a_Qty,
        data.dusts_Lots,             
        data.dusts_Qty,
        data.grandTotal_Lots,        
        data.grandTotal_Qty
    ]

    const [result] = await connection.execute(sql, values)
    return result
}