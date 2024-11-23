const API_URL = "http://localhost:3000/tasks";

const addTaskName = document.getElementById("add-task-name");
const addDeadline = document.getElementById("add-deadline");
const addProjectId = document.getElementById("add-project-id");
const addStatus = document.getElementById("add-status");
const addDateComplete = document.getElementById("add-date-complete");

const editTaskName = document.getElementById("edit-task-name");
const editDeadline = document.getElementById("edit-deadline");
const editProjectId = document.getElementById("edit-project-id");
const editStatus = document.getElementById("edit-status");
const editDateComplete = document.getElementById("edit-date-complete");

const taskTable = document.getElementById("task-table");
const searchBar = document.getElementById("search-bar");

const addForm = document.getElementById("add-task-form");
const editForm = document.getElementById("edit-task-form");

let tasks = [];
let editTaskId = null;

async function fetchTasks() {
  try {
    const res = await fetch(API_URL);
    tasks = await res.json();
    populateTable(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
  }
}

function populateTable(tasks) {
  taskTable.innerHTML = tasks
    .map(
      (task) => `
    <tr>
      <td>${task.task_id}</td> 
      <td>${task.task_name}</td>
      <td>${task.deadline}</td>
      <td>${task.project_id}</td>
      <td>${task.status}</td>
      <td>${task.date_complete || "N/A"}</td>
      <td>
        <button onclick="editTask(${task.task_id})">Edit</button>
        <button onclick="deleteTask(${task.task_id})">Delete</button>
      </td>
    </tr>
  `
    )
    .join("");
}

function searchTasks() {
  const query = searchBar.value.toLowerCase();
  const filteredTasks = tasks.filter((task) =>
    task.task_name.toLowerCase().includes(query)
  );
  populateTable(filteredTasks);
}

async function deleteTask(id) {
  if (confirm("Are you sure you want to delete this task?")) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchTasks();
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
  editTaskId = null;
}

addForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newTask = {
    task_name: addTaskName.value,
    deadline: addDeadline.value,
    project_id: parseInt(addProjectId.value),
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    });

    if (response.ok) {
      alert("Task added successfully!");
      addForm.style.display = "none";
      fetchTasks();
    } else {
      alert("Failed to add task. Please check the server.");
    }
  } catch (err) {
    console.error("Error adding task:", err);
    alert("Error: Could not connect to the server.");
  }
});

function editTask(id) {
  const task = tasks.find((task) => task.task_id === id);
  if (!task) return;

  editTaskId = id;
  editTaskName.value = task.task_name;
  editDeadline.value = task.deadline;
  editProjectId.value = task.project_id;
  editStatus.value = task.status;
  editDateComplete.value = task.date_complete || "";

  openEditForm();
}

editForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const updatedTask = {
    task_name: editTaskName.value,
    deadline: editDeadline.value,
    project_id: editProjectId.value,
    status: editStatus.value,
    date_complete: editDateComplete.value || null,
  };

  await fetch(`${API_URL}/${editTaskId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedTask),
  });

  editForm.style.display = "none";
  fetchTasks();
});

fetchTasks();
