const API_URL = "http://localhost:3000/tasks";
const taskTable = document.getElementById("task-table");
const searchBar = document.getElementById("search-bar");

let tasks = [];

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
        <button onclick="completeTask(${task.task_id})">Complete Task</button>
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

async function completeTask(taskId) {
  const taskID = taskId;
  const form = document.getElementById("taskCompletionForm");

  document.getElementById("taskID").value = taskID;

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (!taskID) {
      alert("Task ID is required");
      return;
    }

    const response = await fetch("/task-completion/complete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ taskID }),
    });

    const data = await response.json();
    if (response.ok) {
      alert(data.message);
    } else {
      alert(data.error);
    }
  });
}

fetchTasks();
