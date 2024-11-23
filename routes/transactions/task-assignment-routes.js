import express from "express";
import { assignTask } from "../../controllers/transactions/task-assignment-controller.js";

const router = express.Router();
// Route to assign a task to an employee
router.post("/assign-task", async (req, res) => {
  const { employeeID, taskID } = req.body;

  if (!employeeID || !taskID) {
    return res
      .status(400)
      .json({ message: "Both employeeID and taskID are required." });
  }

  try {
    const result = await assignTask(employeeID, taskID);

    if (result) {
      return res.status(200).json({
        message: `Task ${taskID} has been successfully assigned to Employee ${employeeID}.`,
      });
    } else {
      return res.status(400).json({
        message: `Failed to assign Task ${taskID} to Employee ${employeeID}.`,
      });
    }
  } catch (error) {
    console.error("Error assigning task:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while assigning the task." });
  }
});

export default router;
