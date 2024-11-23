import express from "express";
import { completeTask } from "../../controllers/transactions/task-completion-controller.js";

const router = express.Router();

router.post("/complete", async (req, res) => {
  try {
    const { taskID } = req.body;

    if (!taskID) {
      return res.status(400).json({ error: "Task ID is required" });
    }

    const success = await completeTask(taskID);

    if (!success) {
      return res
        .status(404)
        .json({ error: "Task not found or already completed" });
    }

    res.status(200).json({
      message: `Task ${taskID} and related entities updated successfully`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to complete the task" });
  }
});

export default router;
