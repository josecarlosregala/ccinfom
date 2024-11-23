async function assignTask() {
  const form = document.getElementById("taskAssignmentForm");

  const emp_id = document.getElementById("emp_id").value;
  const task_id = document.getElementById("task_id").value;

  if (!emp_id || !task_id) {
    alert("Employee ID and Task ID are required.");
    return;
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const response = await fetch("/assign-task", {
      // Adjust this URL to match your server's route
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ employeeID: emp_id, taskID: task_id }),
    });

    const data = await response.json();

    if (response.ok) {
      // If task is assigned successfully, display a success message
      alert(
        `Task ${task_id} has been successfully assigned to Employee ${emp_id}.`
      );
      document.getElementById("emp_id_display").innerText = emp_id;
      document.getElementById("task_id_display").innerText = task_id;
      document.getElementById("status_display").innerText = "Assigned";
      document.getElementById("assignmentDetails").style.display = "block";
      document.getElementById("error-message").style.display = "none";
    } else {
      // If there is an error, display the error message
      document.getElementById("assignmentDetails").style.display = "none";
      document.getElementById("error-message").style.display = "block";
      alert(data.error || "Error assigning task. Please try again.");
    }
  });
}
