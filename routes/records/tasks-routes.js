import express from "express";
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../../controllers/records/tasks-controller.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const tasks = await getAllTasks();
    res.status(200).json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const task = await getTaskById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(200).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch task" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { task_name, deadline, project_id } = req.body;
    const taskId = await createTask(task_name, deadline, project_id);
    res.status(201).json({ message: "Task created", taskId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create task" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { task_name, deadline, project_id, status, date_complete } = req.body;
    const success = await updateTask(
      req.params.id,
      task_name,
      deadline,
      project_id,
      status,
      date_complete
    );
    if (!success) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(200).json({ message: "Task updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update task" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const success = await deleteTask(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

export default router;
