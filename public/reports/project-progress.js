const API_URL = "http://localhost:3000/project-progress";
const progressForm = document.getElementById("projectProgressForm");
const projectProgressDetailsDiv = document.getElementById(
  "projectProgressDetails"
);
const errorMessageDiv = document.getElementById("error-message");

progressForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  try {
    const response = await fetch(API_URL);

    const data = await response.json();

    if (response.ok) {
      const progressList = document.getElementById("projectProgressList");
      progressList.innerHTML = "";
      data.forEach((progress) => {
        const listItem = document.createElement("li");
        listItem.innerText = `${progress.project_name} - ${progress.month_year}: Completed Tasks: ${progress.completed_tasks_count}, Remaining Tasks: ${progress.remaining_tasks_count}`;
        progressList.appendChild(listItem);
      });

      projectProgressDetailsDiv.style.display = "block";
      errorMessageDiv.style.display = "none";
    } else {
      projectProgressDetailsDiv.style.display = "none";
      errorMessageDiv.style.display = "block";
    }
  } catch (error) {
    console.error("Error generating project progress report:", error);
    errorMessageDiv.style.display = "block";
    projectProgressDetailsDiv.style.display = "none";
  }
});
