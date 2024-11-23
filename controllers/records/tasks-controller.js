import pool from "../../db.js";

export async function getAllTasks() {
  const [rows] = await pool.query(`
  SELECT * 
  FROM tasks
  `);
  return rows;
}

export async function getTaskById(id) {
  const [rows] = await pool.query(
    `
    SELECT * 
    FROM tasks 
    WHERE task_id = ?
    `,
    [id]
  );
  return rows[0];
}

export async function createTask(
  task_name,
  deadline,
  project_id,
  status = "ongoing",
  date_complete = null
) {
  const [result] = await pool.query(
    `
    INSERT INTO tasks (task_name, deadline, project_id, status, date_complete)
    VALUES (?, ?, ?, ?, ?)
    `,
    [task_name, deadline, project_id, status, date_complete]
  );
  return result.insertId;
}

export async function updateTask(
  id,
  task_name,
  deadline,
  project_id,
  status,
  date_complete
) {
  const [result] = await pool.query(
    `
    UPDATE tasks 
    SET task_name = ?, deadline = ?, project_id = ?, status = ?, date_complete = ?
    WHERE task_id = ?
    `,
    [task_name, deadline, project_id, status, date_complete, id]
  );
  return result.affectedRows > 0;
}

export async function deleteTask(id) {
  const [result] = await pool.query(
    `
    DELETE 
    FROM tasks 
    WHERE task_id = ?
    `,
    [id]
  );
  return result.affectedRows > 0;
}
