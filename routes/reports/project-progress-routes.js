import express from "express";
import { getProjectProgressReport } from "../../controllers/reports/project-progress-report.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const progressReport = await getProjectProgressReport();

    res.status(200).json(progressReport);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Failed to generate project progress report" });
  }
});

export default router;
