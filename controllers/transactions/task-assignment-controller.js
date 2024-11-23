import pool from "../../db.js";

export async function assignTask(employeeID, taskID) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [taskInfo] = await connection.query(
      `
      SELECT status, project_id 
      FROM Tasks 
      WHERE task_id = ?
      `,
      [taskID]
    );

    if (taskInfo.length === 0) {
      console.log("No task found with ID:", taskID);
      await connection.rollback();
      return false;
    }

    const { status, project_id: projectID } = taskInfo[0];

    if (status === "completed") {
      console.log("Task already completed.");
      await connection.rollback();
      return false;
    }

    await connection.query(
      `
      UPDATE EmployeeTasks et 
      JOIN Tasks t ON et.task_id = t.task_id 
      SET et.emp_status = 'inactive' 
      WHERE et.emp_id = ? AND et.emp_status = 'active' AND t.project_id != ?
      `,
      [employeeID, projectID]
    );

    const [existingAssignment] = await connection.query(
      `
      SELECT * 
      FROM EmployeeTasks 
      WHERE emp_id = ? AND task_id = ?
      `,
      [employeeID, taskID]
    );

    if (existingAssignment.length > 0) {
      await connection.query(
        `
        UPDATE EmployeeTasks 
        SET emp_status = 'active', date_assigned = DATE(NOW()), date_complete = NULL 
        WHERE emp_id = ? AND task_id = ? AND emp_status = 'inactive'
        `,
        [employeeID, taskID]
      );
      console.log(
        `Reactivated assignment for Employee ${employeeID} and Task ${taskID}`
      );
    } else {
      await connection.query(
        `
        INSERT INTO EmployeeTasks (emp_id, task_id, emp_status, date_assigned, date_complete) 
        VALUES (?, ?, 'active', DATE(NOW()), NULL)
        `,
        [employeeID, taskID]
      );
      console.log(
        `Created new assignment for Employee ${employeeID} and Task ${taskID}`
      );
    }

    await connection.commit();
    console.log(
      `Task assignment for Employee ${employeeID} and Task ${taskID} completed successfully.`
    );
    return true;
  } catch (error) {
    await connection.rollback();
    console.error("Error assigning task:", error);
    throw error;
  } finally {
    await connection.release();
  }
}
