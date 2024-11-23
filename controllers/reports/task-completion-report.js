async function EmployeeTaskCompletion() {
  const sql = `
  SELECT 
      e.emp_id,
      e.last_name, 
      e.first_name,
      MONTHNAME(et.date_complete) AS month,
      YEAR(et.date_complete) AS year,
      COUNT(et.task_id) AS completed_tasks
  FROM 
      Employees e
  LEFT JOIN 
    EmployeeTasks et ON et.emp_id = e.emp_id AND et.emp_status = 'completed'
  GROUP BY 
      e.emp_id, 
      e.last_name, 
      e.first_name, 
      YEAR(et.date_complete), 
      MONTH(et.date_complete),
      MONTHNAME(et.date_complete)
  ORDER BY 
      e.last_name, 
      e.first_name, 
      year,
      month
     ;
  `;

  try {
    const [fsReport] = await pool.query(sql);
    return fsReport;
  } catch (error) {
    console.error("Employee task completion report:", error);
    throw error;
  }
}

const result = await EmployeeTaskCompletion();
