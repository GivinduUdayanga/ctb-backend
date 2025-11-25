import MonthlyProduction from "../models/monthlyProduction.js"



export const getMonthlyProductionByYearMonth = async (req, res) => {

    try {
        const {year, month} = req.params

        const [rows] = await MonthlyProduction.getByYearMonth(year, month)

        if (!rows.length) {
            return res.status(404).json ({
                message: "No data found"
            })
        }

        res.json(rows)
    }
    catch (error) {
        console.error("Error fetching monthly production : ", error)
        return res.status(500).json ({
            message: "Internal Server Error",
            error:error.message
        })
    }
}




export const getLatestMonthlyProduction = async (req, res) => {

    try {
        const [rows] = await MonthlyProduction.getLatest()

        if (!rows.length) {
            return res.status(404).json ({
                message: "No Data Found ... "
            })
        }

        res.json(rows)
    }
    catch (error) {
        console.error("Error fetching latest monthly production : ", error)
        return res.status(500).json ({
            message: "Internal Server Error",
            error:error.message
        })
    }
}




export const addMonthlyProduction = async (req, res) => {
  try {
    const { year, month, orthodox, ctc, green_tea, total_tea_production } = req.body;

    if (!year || !month || !orthodox || !ctc || !green_tea || !total_tea_production) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const categories = { orthodox, ctc, green_tea, total_tea_production };
    const records = [];

    for (const [category, elevations] of Object.entries(categories)) {
      for (const elevation of ["high", "medium", "low"]) {
        if (!elevations[elevation]) {
          return res.status(400).json({
            message: `Missing data for ${category} → ${elevation}`
          });
        }

        const { month_qty, ytd_qty } = elevations[elevation];

        if (month_qty == null || ytd_qty == null) {
          return res.status(400).json({
            message: `Missing month_qty/ytd_qty for ${category} → ${elevation}`
          });
        }

        records.push([
          year,
          month,
          category,
          elevation,
          month_qty,
          ytd_qty
        ]);
      }
    }

    await MonthlyProduction.createMany(records);

    res.status(201).json({
      message: "Monthly production data added successfully",
      inserted_rows: records.length
    });

  } catch (error) {
    console.error("Error creating monthly production:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};





export const updateMonthlyProduction = async (req, res) => {
  try {
    const { year, month } = req.params;
    const { orthodox, ctc, green_tea, total_tea_production } = req.body;

    if (!year || !month) {
      return res.status(400).json({ message: "Year & Month are required" });
    }

    if (!orthodox || !ctc || !green_tea || !total_tea_production) {
      return res.status(400).json({ message: "Missing category data" });
    }

    const categories = { orthodox, ctc, green_tea, total_tea_production };
    const records = [];

    for (const [category, elevations] of Object.entries(categories)) {
      for (const elevation of ["high", "medium", "low"]) {

        if (!elevations[elevation]) {
          return res.status(400).json({
            message: `Missing data for ${category} → ${elevation}`,
          });
        }

        const { month_qty, ytd_qty } = elevations[elevation];

        if (month_qty == null || ytd_qty == null) {
          return res.status(400).json({
            message: `Missing month_qty/ytd_qty for ${category} → ${elevation}`,
          });
        }

        records.push({
          category,
          elevation,
          month_qty,
          ytd_qty
        });
      }
    }

    await MonthlyProduction.updateMany(year, month, records);

    res.status(200).json({
      message: "Monthly production updated successfully",
      updated_rows: records.length,
      year,
      month
    });

  } catch (error) {
    console.error("Error updating monthly production:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};





export const deleteMonthlyProduction = async (req, res) => {
  try {
    const { year, month } = req.params;

    if (!year || !month) {
      return res.status(400).json({
        message: "Year & Month are required"
      });
    }

    const [result] = await MonthlyProduction.deleteByYearMonth(year, month);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "No records found for the given year and month"
      });
    }

    res.status(200).json({
      message: "Monthly production records deleted successfully",
      deleted_rows: result.affectedRows,
      year,
      month
    });

  } catch (error) {
    console.error("Error deleting monthly production:", error);

    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};
