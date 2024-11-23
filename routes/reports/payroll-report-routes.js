import express from "express";
import { getPayrollForMonthAndYear } from "../../controllers/reports/financial-summary-report.js";

const router = express.Router();

router.get("/:year/:month", async (req, res) => {
  try {
    const { year, month } = req.params;

    const payrollData = await getPayrollForMonthAndYear(year, month);

    res.status(200).json(payrollData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch payroll data" });
  }
});

export default router;
