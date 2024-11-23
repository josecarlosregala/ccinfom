import pool from "../../db.js";

export async function getPayrollForMonthAndYear(year, month) {
  try {
    const [rows] = await pool.query(
      `
      SELECT 
        ep.emp_id,
        ep.cost AS payroll_expense,
        DATE_FORMAT(ep.payment_date, '%Y-%m') AS payment_month
      FROM 
        employeepayments ep
      WHERE
        YEAR(ep.payment_date) = ? AND MONTH(ep.payment_date) = ?
      ORDER BY 
        ep.emp_id;
      `,
      [year, month]
    );

    if (rows.length === 0) {
      return {
        message: `No payroll records found for ${year}-${month}.`,
        payrollRecords: [],
        totalPayroll: 0,
      };
    }

    let totalPayroll = 0;

    const payrollRecords = rows.map((payment) => {
      totalPayroll += payment.payroll_expense;
      return {
        emp_id: payment.emp_id,
        payroll_expense: payment.payroll_expense,
      };
    });

    return {
      message: `Found ${rows.length} payroll record(s) for ${year}-${month}.`,
      payrollRecords,
      totalPayroll,
    };
  } catch (error) {
    console.error("Error fetching payroll data: ", error);
    throw error;
  }
}
