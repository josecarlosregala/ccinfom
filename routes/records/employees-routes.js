import express from "express";
import {
  createEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
} from "../../controllers/records/employees-controller.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const empId = req.query.emp_id;
    const employees = await getEmployees(empId);
    res.status(200).json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch employees" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const employee = await getEmployees(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.status(200).json(employee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch employee" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { last_name, first_name, position, salary } = req.body;
    const empId = await createEmployee(last_name, first_name, position, salary);
    res.status(201).json({ message: "Employee created", empId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create employee" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { last_name, first_name, hire_date, position, salary } = req.body;
    const success = await updateEmployee(
      req.params.id,
      last_name,
      first_name,
      hire_date,
      position,
      salary
    );
    if (!success) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.status(200).json({ message: "Employee updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update employee" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const success = await deleteEmployee(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.status(200).json({ message: "Employee deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete employee" });
  }
});

export default router;
