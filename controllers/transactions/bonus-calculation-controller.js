import pool from "../../db.js";

export async function calculateAndRecordBonus(emp_id, project_id) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [lastBonusRows] = await connection.query(
      `
      SELECT MAX(payment_date) AS last_bonus_date
      FROM EmployeePayments
      WHERE emp_id = ? AND payment_type = 'bonus'
      `,
      [emp_id]
    );

    const last_bonus_date = lastBonusRows[0]?.last_bonus_date || '1970-01-01';

    const [taskCountRows] = await connection.query(
      `
      SELECT COUNT(*) AS completed_tasks
      FROM EmployeeTasks
      WHERE emp_id = ? AND emp_status = 'completed' AND date_complete > ?
      `,
      [emp_id, last_bonus_date || "1970-01-01"]
    );

    const completed_tasks = taskCountRows[0]?.completed_tasks || 0;

    const [projectDetailsRows] = await connection.query(
      `
      SELECT tasks_per_bonus, bonus_amount
      FROM Projects
      WHERE project_id = ?
      `,
      [project_id]
      );

    const { tasks_per_bonus, bonus_amount } = projectDetailsRows[0];

    const eligible_bonus =
      Math.floor(completed_tasks / tasks_per_bonus) * bonus_amount;

    if (eligible_bonus > 0) {
      
        const expense_name = `Bonus for Employee ${emp_id}`;
        const expense_type = "employee payment";
        const cost = eligible_bonus;

        const [expenseResult] = await connection.query(
          `
          INSERT INTO EmployeeManagement.Expenses (expense_name, expense_type, expense_date, cost)
          VALUES (?, ?, NOW(), ?)
          `,
          [expense_name, expense_type, cost]
        );

        if (expenseResult.affectedRows === 0) {
          console.error("Failed to record expense.");
          await connection.rollback();
          return false;
        }
        
      const [insertPaymentResult] = await connection.query(
        `
        INSERT INTO EmployeePayments (emp_id, expense_id, payment_type, cost, payment_date)
        VALUES (?, ?, 'bonus', ?, NOW())
        `,
        [emp_id, expenseResult.insertId, eligible_bonus]
      );

      if (insertPaymentResult.affectedRows === 0) {
        console.error("Failed to record bonus payment.");
        await connection.rollback();
        return false;
      }
    }

    await connection.commit();

    return {
      emp_id,
      completed_tasks,
      tasks_per_bonus,
      bonus_amount,
      eligible_bonus,
    };
  } catch (error) {
    await connection.rollback();
    console.error("Error during transaction:", error);
    throw error;
  } finally {
    await connection.release();
  }
}
