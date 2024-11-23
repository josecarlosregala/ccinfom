// test-employees-controller.js

import {
  createEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
} from "./controllers/employees-controller.js";

// Test: Get All Employees
async function testGetAllEmployees() {
  try {
    const employees = await getEmployees();
    console.log("All Employees:", employees);
  } catch (err) {
    console.error("Error fetching all employees:", err);
  }
}

// Test: Get Employee By ID
async function testGetEmployeeById(id) {
  try {
    const employee = await getEmployees(id);
    console.log(`Employee with ID ${id}:`, employee);
  } catch (err) {
    console.error(`Error fetching employee with ID ${id}:`, err);
  }
}

// Test: Create Employee
async function testCreateEmployee() {
  try {
    const newEmployeeId = await createEmployee(
      "Doe",
      "John",
      "Developer",
      75000
    );
    console.log("New Employee Created with ID:", newEmployeeId);
    await testGetEmployeeById(newEmployeeId); // Fetch the employee just created
  } catch (err) {
    console.error("Error creating employee:", err);
  }
}

// Test: Update Employee
async function testUpdateEmployee(id) {
  try {
    const updated = await updateEmployee(
      id,
      "Smith",
      "Jane",
      "2023-10-15",
      "Manager",
      95000
    );
    if (updated) {
      console.log(`Employee with ID ${id} updated.`);
      await testGetEmployeeById(id); // Fetch updated employee
    } else {
      console.log(`Employee with ID ${id} not found for update.`);
    }
  } catch (err) {
    console.error(`Error updating employee with ID ${id}:`, err);
  }
}

// Test: Delete Employee
async function testDeleteEmployee(id) {
  try {
    const deleted = await deleteEmployee(id);
    if (deleted) {
      console.log(`Employee with ID ${id} was deleted.`);
    } else {
      console.log(`Employee with ID ${id} was not found for deletion.`);
    }
  } catch (err) {
    console.error(`Error deleting employee with ID ${id}:`, err);
  }
}

async function runTests() {
  // Create a new employee for testing other CRUD operations
  // await testCreateEmployee();

  // // Test getting all employees
  // await testGetAllEmployees();

  // // Test specific employee fetch, update, and delete
  const employeeId = 3; // Replace with actual employee ID after creation
  // await testGetEmployeeById(employeeId);
  // await testUpdateEmployee(employeeId);
  await testDeleteEmployee(employeeId);
}

// Start testing
runTests();
