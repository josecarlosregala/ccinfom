import express from "express";
import { calculateAndRecordBonus } from "../../controllers/transactions/bonus-calculation-controller.js";

const router = express.Router();

router.post("/calculate-bonus", async (req, res) => {
  try {
    const { emp_id, project_id } = req.body;

    if (!emp_id || !project_id) {
      return res
        .status(400)
        .json({ error: "Employee ID and Project ID are required" });
    }

    const bonusDetails = await calculateAndRecordBonus(emp_id, project_id);

    if (!bonusDetails || bonusDetails.eligible_bonus === 0) {
      return res.status(404).json({
        error:
          "No eligible bonus calculated for the provided employee and project",
      });
    }

    res.status(200).json({
      message: `Bonus calculated and recorded successfully for employee ${emp_id}`,
      bonusDetails,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to calculate and record bonus" });
  }
});

export default router;
