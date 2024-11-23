import pool from "../../db.js";

async function getProjectIdForExpense(expenseId, connection) {
  const [rows] = await connection.query(
    `SELECT project_id FROM expenses WHERE expense_id = ?`,
    [expenseId]
  );
  return rows[0] ? rows[0].project_id : null;
}

async function updateExpenseProjectId(expenseId, projectId, connection) {
  const result = await connection.query(
    `UPDATE expenses SET project_id = ? WHERE expense_id = ?`,
    [projectId, expenseId]
  );
  return result;
}

async function getExpensesForProject(projectId, connection) {
  const [rows] = await connection.query(
    `SELECT expense_id, expense_name, cost FROM expenses WHERE project_id = ?`,
    [projectId]
  );
  return rows;
}

async function getRemainingBudget(projectId, connection) {
  const [rows] = await connection.query(
    `SELECT remaining_budget FROM projects WHERE project_id = ?`,
    [projectId]
  );
  return rows[0] ? rows[0].remaining_budget : 0;
}

async function updateRemainingBudget(projectId, remainingBudget, connection) {
  const result = await connection.query(
    `UPDATE projects SET remaining_budget = ? WHERE project_id = ?`,
    [remainingBudget, projectId]
  );
  return result;
}

export async function linkExpenseToProject(expenseId, projectId) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const existingProjectId = await getProjectIdForExpense(
      expenseId,
      connection
    );
    if (existingProjectId) {
      console.log(
        `Expense ID ${expenseId} already has a project ID: ${existingProjectId}.`
      );
      await connection.rollback();
      return {
        success: false,
        message: `Expense ID ${expenseId} already linked to a project.`,
      };
    }

    const expenses = await getExpensesForProject(projectId, connection);
    let totalExpenses = 0;
    console.log(`Expense breakdown for project ${projectId}:`);
    expenses.forEach((expense) => {
      console.log(
        `Expense ID: ${expense.expense_id}, Expense Name: ${expense.expense_name}, Cost: ${expense.cost}`
      );
      totalExpenses += expense.cost;
    });

    const remainingBudget = await getRemainingBudget(projectId, connection);
    console.log(
      `Remaining budget for project ${projectId}: ${remainingBudget}`
    );

    const [expenseCostRow] = await connection.query(
      `SELECT cost FROM expenses WHERE expense_id = ?`,
      [expenseId]
    );
    const expenseCost = expenseCostRow[0].cost;

    const finalRemainingBudget = remainingBudget - totalExpenses + expenseCost;

    if (finalRemainingBudget < 0) {
      console.log(
        "Cannot bind the expense to the project as it would exceed the remaining budget."
      );
      await connection.rollback();
      return {
        success: false,
        message: "Budget exceeded. Cannot link expense to project.",
      };
    }

    await updateExpenseProjectId(expenseId, projectId, connection);
    console.log(
      `Expense ID ${expenseId} has been linked to Project ID ${projectId}.`
    );

    await updateRemainingBudget(projectId, finalRemainingBudget, connection);
    console.log(
      `Updated remaining budget for project ${projectId} to ${finalRemainingBudget}`
    );

    await connection.commit();
    console.log("Transaction completed successfully.");
    return {
      success: true,
      message: `Expense ID ${expenseId} linked to Project ID ${projectId}.`,
    };
  } catch (error) {
    await connection.rollback();
    console.error("Error during transaction: ", error);
    return {
      success: false,
      message: "Error occurred while linking expense to project.",
    };
  } finally {
    await connection.release();
  }
}
