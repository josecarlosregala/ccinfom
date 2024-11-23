import pool from "../../db.js";

export async function createEmployee(last_name, first_name, position, salary) {
  const [result] = await pool.query(
    `
    INSERT INTO Employees (last_name, first_name, hire_date, position, salary)
    VALUES (?, ?, NOW(), ?, ?)
    `,
    [last_name, first_name, position, salary]
  );
  return result.insertId;
}

export async function getEmployees(emp_id = null) {
  const query = emp_id
    ? `
      SELECT * 
      FROM Employees 
      WHERE emp_id = ?
    `
    : `
      SELECT * 
      FROM Employees
    `;
  const values = emp_id ? [emp_id] : [];
  const [rows] = await pool.query(query, values);
  return emp_id ? rows[0] : rows;
}

export async function updateEmployee(
  emp_id,
  last_name,
  first_name,
  hire_date,
  position,
  salary
) {
  const [result] = await pool.query(
    `
    UPDATE Employees
    SET last_name = ?, first_name = ?, hire_date = ?, position = ?, salary = ?
    WHERE emp_id = ?
    `,
    [last_name, first_name, hire_date, position, salary, emp_id]
  );
  return result.affectedRows > 0;
}

export async function deleteEmployee(emp_id) {
  const [result] = await pool.query(
    `
    DELETE 
    FROM Employees 
    WHERE emp_id = ?
    `,
    [emp_id]
  );
  return result.affectedRows > 0;
}
