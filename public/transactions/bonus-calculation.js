const API_URL = "http://localhost:3000/bonus-calculation/calculate-bonus";
const bonusForm = document.getElementById("bonusCalculationForm");
const bonusDetailsDiv = document.getElementById("bonusDetails");
const errorMessageDiv = document.getElementById("error-message");

bonusForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const emp_id = document.getElementById("emp_id").value;
  const project_id = document.getElementById("project_id").value;

  if (!emp_id || !project_id) {
    alert("Employee ID and Project ID are required");
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ emp_id, project_id }),
    });

    const data = await response.json();

    if (response.ok) {
      document.getElementById("emp_id_display").innerText =
        data.bonusDetails.emp_id;
      document.getElementById("completed_tasks").innerText =
        data.bonusDetails.completed_tasks;
      document.getElementById("tasks_per_bonus").innerText =
        data.bonusDetails.tasks_per_bonus;
      document.getElementById("bonus_amount").innerText =
        data.bonusDetails.bonus_amount;
      document.getElementById("eligible_bonus").innerText =
        data.bonusDetails.eligible_bonus;

      bonusDetailsDiv.style.display = "block";
      errorMessageDiv.style.display = "none";
    } else {
      bonusDetailsDiv.style.display = "none";
      errorMessageDiv.style.display = "block";
    }
  } catch (error) {
    console.error("Error calculating bonus:", error);
    errorMessageDiv.style.display = "block";
    bonusDetailsDiv.style.display = "none";
  }
});
