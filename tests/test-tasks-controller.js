// test-tasks-controller.js

import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "./controllers/tasks-controller.js";
// Test: Get All Tasks
async function testGetAllTasks() {
  try {
    const tasks = await getAllTasks();
    console.log("All Tasks:", tasks);
  } catch (err) {
    console.error("Error fetching all tasks:", err);
  }
}

// Test: Get Task By ID
async function testGetTaskById(id) {
  try {
    const task = await getTaskById(id);
    console.log(`Task with ID ${id}:`, task);
  } catch (err) {
    console.error(`Error fetching task with ID ${id}:`, err);
  }
}

// Test: Create Task
async function testCreateTask() {
  try {
    const taskId = await createTask(
      "New Test Task",
      "2024-12-01",
      1,
      "ongoing",
      null
    );
    console.log("New Task Created with ID:", taskId);
    await testGetTaskById(taskId); // Fetch the task just created
  } catch (err) {
    console.error("Error creating task:", err);
  }
}

// Test: Update Task
async function testUpdateTask(id) {
  try {
    const updated = await updateTask(
      id,
      "Updated Task Name",
      "2024-12-15",
      1,
      "completed",
      "2024-12-10"
    );
    if (updated) {
      console.log(`Task with ID ${id} updated.`);
      await testGetTaskById(id); // Fetch updated task
    } else {
      console.log(`Task with ID ${id} not found for update.`);
    }
  } catch (err) {
    console.error(`Error updating task with ID ${id}:`, err);
  }
}

// Test: Delete Task
async function testDeleteTask(id) {
  try {
    const deleted = await deleteTask(id);
    if (deleted) {
      console.log(`Task with ID ${id} was deleted.`);
    } else {
      console.log(`Task with ID ${id} was not found for deletion.`);
    }
  } catch (err) {
    console.error(`Error deleting task with ID ${id}:`, err);
  }
}
async function runTests() {
  // Create a new task for testing other CRUD operations
  // await testCreateTask();

  // // Test getting all tasks
  await testGetAllTasks();

  // // Test specific task fetch, update, and delete
  // const taskId = 1; // Replace with actual task ID after creation
  // await testGetTaskById(2);
  // await testUpdateTask(2);
  // await testDeleteTask(2);
}

// Start testing
runTests();
