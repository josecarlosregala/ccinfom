import pool from "../../db.js";

// Generate total expenses and remaining budget per project per month
async function generateFinancialSummary() {
  const sql = `
  SELECT 
      p.project_id, 
      p.project_name,
      MONTHNAME(e.expense_date) AS month,
      YEAR(e.expense_date) AS year,
      COALESCE(SUM(e.cost), 0) AS total_expenses, 
      (p.remaining_budget - COALESCE(SUM(e.cost), 0)) AS remaining_budget
  FROM 
      Projects p
  LEFT JOIN 
      Expenses e ON p.project_id = e.project_id
  GROUP BY 
      p.project_id, p.project_name, YEAR(e.expense_date), MONTH(e.expense_date), MONTHNAME(e.expense_date)
  ORDER BY 
      p.project_id, YEAR(e.expense_date), MONTH(e.expense_date);
  `;

  try {
    const [fsReport] = await pool.query(sql);
    return fsReport;
  } catch (error) {
    console.error("Error generating financial summary:", error);
    throw error;
  }
}

const result = await generateFinancialSummary();
console.log(result);
await pool.end();
