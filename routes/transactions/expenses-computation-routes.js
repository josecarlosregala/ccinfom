import express from "express";
import { linkExpenseToProject } from "../../controllers/transactions/expenses-computation-controller.js";

const router = express.Router();

router.post("/compute-expense", async (req, res) => {
  console.log("Request received for /compute-task");
  const { expenseId, projectId } = req.body;

  if (!expenseId || !projectId) {
    return res
      .status(400)
      .json({ error: "Expense ID and Project ID are required." });
  }

  try {
    const result = await linkExpenseToProject(expenseId, projectId);

    if (result.success) {
      return res.status(200).json({ message: result.message });
    } else {
      return res.status(400).json({ error: result.message });
    }
  } catch (error) {
    console.error("Error in /link-expense route:", error);
    return res.status(500).json({ error: "Server error occurred." });
  }
});

export default router;
