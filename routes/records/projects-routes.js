import express from "express";
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectTasks,
} from "../../controllers/records/projects-controller.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const projects = await getAllProjects();
    res.status(200).json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const project = await getProjectById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.status(200).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch project" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { project_name, remaining_budget, tasks_per_bonus, bonus_amount } =
      req.body;
    const projectId = await createProject(
      project_name,
      remaining_budget,
      tasks_per_bonus,
      bonus_amount
    );
    res.status(201).json({ message: "Project created", projectId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create project" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const {
      project_name,
      start_date,
      end_date,
      remaining_budget,
      tasks_per_bonus,
      bonus_amount,
      status,
    } = req.body;
    const success = await updateProject(
      req.params.id,
      project_name,
      start_date,
      end_date,
      remaining_budget,
      tasks_per_bonus,
      bonus_amount,
      status
    );
    if (!success) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.status(200).json({ message: "Project updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update project" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const success = await deleteProject(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.status(200).json({ message: "Project deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete project" });
  }
});

router.get("/:id/tasks", async (req, res) => {
  try {
    const tasks = await getProjectTasks(req.params.id);
    res.status(200).json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tasks for project" });
  }
});

export default router;
