const API_URL = "http://localhost:3000/projects";

const addProjectName = document.getElementById("add-project-name");
const addRemainingBudget = document.getElementById("add-remaining-budget");
const addTasksPerBonus = document.getElementById("add-tasks-per-bonus");
const addBonusAmount = document.getElementById("add-bonus-amount");

const editProjectName = document.getElementById("edit-project-name");
const editRemainingBudget = document.getElementById("edit-remaining-budget");
const editTasksPerBonus = document.getElementById("edit-tasks-per-bonus");
const editBonusAmount = document.getElementById("edit-bonus-amount");
const editStatus = document.getElementById("edit-status");
const editStartDate = document.getElementById("edit-start-date");
const editEndDate = document.getElementById("edit-end-date");

const projectTable = document.getElementById("project-table");
const searchBar = document.getElementById("search-bar");

const addForm = document.getElementById("add-project-form");
const editForm = document.getElementById("edit-project-form");

let projects = [];
let editProjectId = null;

async function fetchProjects() {
  try {
    const res = await fetch(API_URL);
    projects = await res.json();
    populateTable(projects);
  } catch (err) {
    console.error("Error fetching projects:", err);
  }
}

function populateTable(projects) {
  projectTable.innerHTML = projects
    .map(
      (project) => `
    <tr>
    <td>${project.project_id}</td>
      <td>${project.project_name}</td>
      <td>${project.remaining_budget}</td>
      <td>${project.status}</td>
      <td>
        <button onclick="editProject(${project.project_id})">Edit</button>
        <button onclick="deleteProject(${project.project_id})">Delete</button>
      </td>
    </tr>
  `
    )
    .join("");
}

function searchProjects() {
  const query = searchBar.value.toLowerCase();
  const filteredProjects = projects.filter((project) =>
    project.project_name.toLowerCase().includes(query)
  );
  populateTable(filteredProjects);
}

async function deleteProject(id) {
  if (confirm("Are you sure you want to delete this project?")) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchProjects();
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
  editProjectId = null;
}

addForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newProject = {
    project_name: addProjectName.value,
    remaining_budget: parseFloat(addRemainingBudget.value),
    tasks_per_bonus: parseInt(addTasksPerBonus.value),
    bonus_amount: parseFloat(addBonusAmount.value),
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProject),
    });

    if (response.ok) {
      alert("Project added successfully!");
      addForm.style.display = "none";
      fetchProjects();
    } else {
      alert("Failed to add project.");
    }
  } catch (err) {
    console.error("Error adding project:", err);
    alert("Error: Could not connect to the server.");
  }
});

function editProject(id) {
  const project = projects.find((project) => project.project_id === id);
  if (!project) return;

  editProjectId = id;
  editProjectName.value = project.project_name;
  editRemainingBudget.value = project.remaining_budget;
  editTasksPerBonus.value = project.tasks_per_bonus;
  editBonusAmount.value = project.bonus_amount;
  editStatus.value = project.status;
  editStartDate.value = project.start_date ? project.start_date : "";
  editEndDate.value = project.end_date ? project.end_date : "";

  openEditForm();
}

editForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const updatedProject = {
    project_name: editProjectName.value,
    remaining_budget: parseFloat(editRemainingBudget.value),
    tasks_per_bonus: parseInt(editTasksPerBonus.value),
    bonus_amount: parseFloat(editBonusAmount.value),
    status: editStatus.value,
    start_date: editStartDate.value,
    end_date: editEndDate.value,
  };

  try {
    const response = await fetch(`${API_URL}/${editProjectId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProject),
    });

    if (response.ok) {
      alert("Project updated successfully!");
      closeEditForm();
      fetchProjects();
    } else {
      alert("Failed to update project.");
    }
  } catch (err) {
    console.error("Error updating project:", err);
    alert("Error: Could not connect to the server.");
  }
});

fetchProjects();
