async function getPayrollForMonthAndYear(year, month) {
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
  return rows;
}

rl.question("Enter the year for the payroll report (e.g., 2024): ", (year) => {
  rl.question(
    "Enter the month for the payroll report (1-12): ",
    async (month) => {
      try {
        year = parseInt(year);
        month = parseInt(month);

        // Get payroll details for the given year and month
        const payroll = await getPayrollForMonthAndYear(year, month);

        if (payroll.length === 0) {
          console.log(`No payroll records found for ${year}-${month}.`);
          rl.close();
          process.exit(); // Gracefully exit if no records found
          return;
        }

        console.log(
          `Found ${payroll.length} payroll record(s) for ${year}-${month}:`
        );
        let totalPayroll = 0;

        payroll.forEach((payment) => {
          console.log(
            `Employee ID: ${payment.emp_id}, Payroll Expense: ${payment.payroll_expense}`
          );
          totalPayroll += payment.payroll_expense;
        });

        console.log(
          `Total payroll expenses for ${year}-${month}: ${totalPayroll}`
        );

        rl.close();
        process.exit(); // Gracefully exit after displaying the report
      } catch (error) {
        console.error("Error: ", error);
        rl.close();
        process.exit(); // Gracefully exit if an error occurs
      }
    }
  );
});
