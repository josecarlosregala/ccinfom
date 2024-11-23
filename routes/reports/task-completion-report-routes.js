import express from "express";
import { EmployeeTaskCompletion } from "../../controllers/reports/task-completion-report.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const taskCompletionReport = await EmployeeTaskCompletion();

    res.status(200).json(taskCompletionReport);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Failed to generate employee task completion report" });
  }
});

export default router;
