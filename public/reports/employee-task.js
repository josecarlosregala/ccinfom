const API_URL = "http://localhost:3000/task-completion-report";
const employeeTaskForm = document.getElementById("employeeTaskForm");
const employeeTaskDetailsDiv = document.getElementById("employeeTaskDetails");
const errorMessageDiv = document.getElementById("error-message");
const employeeTaskTable = document.getElementById("employeeTaskTable");

employeeTaskForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  try {
    const response = await fetch(API_URL);

    const data = await response.json();

    if (response.ok) {
      populateTable(data);
      employeeTaskDetailsDiv.style.display = "block";
      errorMessageDiv.style.display = "none";
    } else {
      employeeTaskDetailsDiv.style.display = "none";
      errorMessageDiv.style.display = "block";
    }
  } catch (error) {
    console.error("Error generating employee task completion report:", error);
    errorMessageDiv.style.display = "block";
    employeeTaskDetailsDiv.style.display = "none";
  }
});

function populateTable(tasks) {
  employeeTaskTable.innerHTML = tasks
    .map(
      (task) => `
    <tr>
      <td>${task.first_name} ${task.last_name}</td>
      <td>${task.month}</td>
      <td>${task.completed_tasks_count}</td>
    </tr>
  `
    )
    .join("");
}
