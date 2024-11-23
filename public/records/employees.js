const API_URL = "http://localhost:3000/employees";

const addLastName = document.getElementById("add-last-name");
const addFirstName = document.getElementById("add-first-name");
const addPosition = document.getElementById("add-position");
const addSalary = document.getElementById("add-salary");

const editLastName = document.getElementById("edit-last-name");
const editFirstName = document.getElementById("edit-first-name");
const editPosition = document.getElementById("edit-position");
const editSalary = document.getElementById("edit-salary");
const editHireDate = document.getElementById("edit-hire-date");

const employeeTable = document.getElementById("employee-table");
const searchBar = document.getElementById("search-bar");

const addForm = document.getElementById("add-employee-form");
const editForm = document.getElementById("edit-employee-form");

let employees = [];
let editEmployeeId = null;

async function fetchEmployees() {
  try {
    const res = await fetch(API_URL);
    employees = await res.json();
    populateTable(employees);
  } catch (err) {
    console.error("Error fetching employees:", err);
  }
}

function populateTable(employees) {
  employeeTable.innerHTML = employees
    .map(
      (employee) => `
    <tr>
    <td>${employee.emp_id}</td>
      <td>${employee.last_name}</td>
      <td>${employee.first_name}</td>
      <td>${employee.position}</td>
      <td>${employee.salary}</td>
      <td>${employee.hire_date}</td>
      <td>
        <button onclick="editEmployee(${employee.emp_id})">Edit</button>
        <button onclick="deleteEmployee(${employee.emp_id})">Delete</button>
      </td>
    </tr>
  `
    )
    .join("");
}

function searchEmployees() {
  const query = searchBar.value.toLowerCase();
  const filteredEmployees = employees.filter(
    (employee) =>
      employee.last_name.toLowerCase().includes(query) ||
      employee.first_name.toLowerCase().includes(query)
  );
  populateTable(filteredEmployees);
}

async function deleteEmployee(id) {
  if (confirm("Are you sure you want to delete this employee?")) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchEmployees();
  }
}

function openAddForm() {
  closeEditForm();
  addForm.style.display = "block";
}

function closeAddForm() {
  addForm.style.display = "none";
}

function openEditForm() {
  closeAddForm();
  editForm.style.display = "block";
}

function closeEditForm() {
  editForm.style.display = "none";
  editEmployeeId = null;
}

addForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newEmployee = {
    last_name: addLastName.value,
    first_name: addFirstName.value,
    position: addPosition.value,
    salary: parseFloat(addSalary.value),
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEmployee),
    });

    if (response.ok) {
      alert("Employee added successfully!");
      addForm.style.display = "none";
      fetchEmployees();
    } else {
      alert("Failed to add employee. Please check the server.");
    }
  } catch (err) {
    console.error("Error adding employee:", err);
    alert("Error: Could not connect to the server.");
  }
});

function editEmployee(id) {
  const employee = employees.find((emp) => emp.emp_id === id);
  if (!employee) return;

  editEmployeeId = id;
  editLastName.value = employee.last_name;
  editFirstName.value = employee.first_name;
  editPosition.value = employee.position;
  editSalary.value = employee.salary;
  editHireDate.value = employee.hire_date;

  openEditForm();
}

editForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const updatedEmployee = {
    last_name: editLastName.value,
    first_name: editFirstName.value,
    position: editPosition.value,
    salary: editSalary.value,
    hire_date: editHireDate.value,
  };

  await fetch(`${API_URL}/${editEmployeeId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedEmployee),
  });

  editForm.style.display = "none";
  fetchEmployees();
});

fetchEmployees();
