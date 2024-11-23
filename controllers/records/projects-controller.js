import pool from "../../db.js";

export async function getAllProjects() {
  const [rows] = await pool.query(`
    SELECT * 
    FROM projects
  `);
  return rows;
}

export async function getProjectById(project_id) {
  const [rows] = await pool.query(
    `
    SELECT * 
    FROM projects 
    WHERE project_id = ?
    `,
    [project_id]
  );
  return rows[0];
}

export async function createProject(
  project_name,
  remaining_budget,
  tasks_per_bonus,
  bonus_amount
) {
  if (
    (tasks_per_bonus === 0 && bonus_amount !== 0) ||
    (tasks_per_bonus !== 0 && bonus_amount === 0)
  ) {
    console.log("Invalid input.");
    return;
  }

  const [result] = await pool.query(
    `
    INSERT INTO projects (project_name, start_date, end_date, remaining_budget, tasks_per_bonus, bonus_amount, status)
    VALUES (?, DATE(NOW()), NULL, ?, ?, ?, 'ongoing')
    `,
    [project_name, remaining_budget, tasks_per_bonus, bonus_amount]
  );
  return result.insertId;
}

export async function updateProject(
  project_id,
  project_name,
  start_date,
  end_date,
  remaining_budget,
  tasks_per_bonus,
  bonus_amount,
  status
) {
  if (
    (tasks_per_bonus === 0 && bonus_amount !== 0) ||
    (tasks_per_bonus !== 0 && bonus_amount === 0)
  ) {
    console.log("Invalid input.");
    return;
  }

  const [result] = await pool.query(
    `
    UPDATE projects 
    SET project_name = ?, start_date = ?, end_date = ?, remaining_budget = ?, tasks_per_bonus = ?, bonus_amount = ?, status = ? 
    WHERE project_id = ?
    `,
    [
      project_name,
      start_date,
      end_date,
      remaining_budget,
      tasks_per_bonus,
      bonus_amount,
      status,
      project_id,
    ]
  );
  return result.affectedRows > 0;
}

export async function deleteProject(project_id) {
  const [result] = await pool.query(
    `
    DELETE FROM projects 
    WHERE project_id = ?
    `,
    [project_id]
  );
  return result.affectedRows > 0;
}

export async function getProjectTasks(project_id) {
  const [rows] = await pool.query(
    `
    SELECT task_id, task_name 
    FROM tasks 
    WHERE project_id = ?
    `,
    [project_id]
  );
  return rows;
}
