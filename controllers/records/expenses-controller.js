import pool from "../../db.js";

export async function createExpense(expense_name, expense_type, cost) {
  const [result] = await pool.query(
    `
    INSERT INTO EmployeeManagement.Expenses (expense_name, expense_type, expense_date, cost)
    VALUES (?, ?, NOW(), ?)
    `,
    [expense_name, expense_type, cost]
  );
  return result.insertId;
}

export async function getExpenses(expense_id = null) {
  const query = expense_id
    ? "SELECT * FROM EmployeeManagement.Expenses WHERE expense_id = ?"
    : "SELECT * FROM EmployeeManagement.Expenses";
  const values = expense_id ? [expense_id] : [];
  const [rows] = await pool.query(query, values);
  return rows;
}

export async function updateExpense(
  expense_id,
  expense_name,
  expense_type,
  expense_date,
  cost,
  project_id
) {
  const [result] = await pool.query(
    `
    UPDATE EmployeeManagement.Expenses
    SET expense_name = ?, expense_type = ?, expense_date = ?, cost = ?, project_id = ?
    WHERE expense_id = ?
    `,
    [expense_name, expense_type, expense_date, cost, project_id, expense_id]
  );
  return result.affectedRows > 0;
}

export async function deleteExpense(expense_id) {
  const [result] = await pool.query(
    `
    DELETE FROM EmployeeManagement.Expenses WHERE expense_id = ?
    `,
    [expense_id]
  );
  return result.affectedRows > 0;
}
