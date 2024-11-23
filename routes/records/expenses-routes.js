import express from "express";
import {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} from "../../controllers/records/expenses-controller.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const expenses = await getExpenses();
    res.status(200).json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const expense = await getExpenses(req.params.id);
    if (!expense || expense.length === 0) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.status(200).json(expense[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch expense" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { expense_name, expense_type, cost } = req.body;
    const expenseId = await createExpense(expense_name, expense_type, cost);
    res.status(201).json({ message: "Expense created", expenseId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create expense" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { expense_name, expense_type, expense_date, cost, project_id } =
      req.body;
    const success = await updateExpense(
      req.params.id,
      expense_name,
      expense_type,
      expense_date,
      cost,
      project_id
    );
    if (!success) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.status(200).json({ message: "Expense updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update expense" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const success = await deleteExpense(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.status(200).json({ message: "Expense deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete expense" });
  }
});

export default router;
