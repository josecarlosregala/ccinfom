import express from "express";
import { generateFinancialSummary } from "../../controllers/financial/financial-summary-controller.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const financialSummary = await generateFinancialSummary();

    res.status(200).json(financialSummary);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate financial summary" });
  }
});

export default router;
