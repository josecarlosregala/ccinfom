import pool from "../../db.js";

export async function getProjectProgressReport() {
  try {
    const query = `
      SELECT 
        p.project_id,
        p.project_name,
        DATE_FORMAT(t.date_complete, '%Y-%m') AS month_year,
        GROUP_CONCAT(CASE WHEN t.status = 'completed' THEN t.task_name END SEPARATOR ', ') AS completed_tasks_list,
        COUNT(CASE WHEN t.status = 'completed' THEN 1 END) AS completed_tasks_count,
        GROUP_CONCAT(CASE WHEN t.status != 'completed' THEN t.task_name END SEPARATOR ', ') AS remaining_tasks_list,
        COUNT(CASE WHEN t.status != 'completed' THEN 1 END) AS remaining_tasks_count
      FROM Projects p
      LEFT JOIN Tasks t ON p.project_id = t.project_id
      GROUP BY p.project_id, p.project_name, month_year
      ORDER BY p.project_id, month_year;
    `;
    const [rows] = await pool.query(query);

    const report = rows.map((row) => ({
      project_id: row.project_id,
      project_name: row.project_name,
      month_year: row.month_year,
      completed_tasks_count: row.completed_tasks_count,
      completed_tasks_list: row.completed_tasks_list
        ? row.completed_tasks_list.split(", ")
        : [],
      remaining_tasks_count: row.remaining_tasks_count,
      remaining_tasks_list: row.remaining_tasks_list
        ? row.remaining_tasks_list.split(", ")
        : [],
    }));

    return report;
  } catch (error) {
    console.error("Error generating Project Progress Report:", error.message);
    throw error;
  }
}
