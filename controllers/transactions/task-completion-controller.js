import pool from "../../db.js";

export async function completeTask(taskID) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [taskStatusRows] = await connection.query(
      `
      SELECT status 
      FROM Tasks 
      WHERE task_id = ?
      `,
      [taskID]
    );

    if (taskStatusRows.length === 0) {
      console.log(`Task with ID ${taskID} not found.`);
      await connection.rollback();
      return false;
    }

    const { status } = taskStatusRows[0];
    if (status === "completed") {
      console.log(`Task with ID ${taskID} is already completed.`);
      await connection.rollback();
      return false;
    }

    const [updateTaskResult] = await connection.query(
      `
      UPDATE Tasks 
      SET status = 'completed', date_complete = DATE(NOW()) 
      WHERE task_id = ?
      `,
      [taskID]
    );

    if (updateTaskResult.affectedRows === 0) {
      console.error(`Failed to update task ${taskID}.`);
      await connection.rollback();
      return false;
    }

    await connection.query(
      `
      UPDATE EmployeeTasks 
      SET emp_status = 'completed', date_complete = DATE(NOW()) 
      WHERE task_id = ? AND emp_status = 'active'
      `,
      [taskID]
    );

    const [projectRows] = await connection.query(
      `
      SELECT project_id 
      FROM Tasks 
      WHERE task_id = ?
      `,
      [taskID]
    );

    const projectID = projectRows[0]?.project_id;

    if (projectID) {
      const [incompleteTasks] = await connection.query(
        `
        SELECT COUNT(*) AS incomplete_tasks 
        FROM Tasks 
        WHERE project_id = ? AND status != 'completed'
        `,
        [projectID]
      );

      const nIncompleteTasks = incompleteTasks[0].incomplete_tasks;

      if (nIncompleteTasks === 0) {
        await connection.query(
          `
          UPDATE Projects 
          SET status = 'completed', end_date = DATE(NOW()) 
          WHERE project_id = ?
          `,
          [projectID]
        );
        console.log(`Project ${projectID} marked as completed.`);
      }
    }

    await connection.commit();
    console.log(`Task ${taskID} and related entities updated successfully.`);
    return true;
  } catch (error) {
    await connection.rollback();
    console.error("Error during transaction:", error);
    throw error;
  } finally {
    await connection.release();
  }
}
