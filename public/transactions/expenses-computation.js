const API_URL = "http://localhost:3000/expenses-computation/compute-expense";
const expenseLinkForm = document.getElementById("expenseLinkForm");

expenseLinkForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const expenseId = document.getElementById("expenseId").value;
  const projectId = document.getElementById("projectId").value;

  if (!expenseId || !projectId) {
    alert("Both Expense ID and Project ID are required");
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ expenseId, projectId }),
    });

    const data = await response.json();
    if (response.ok) {
      alert(data.message);
    } else {
      alert(data.error);
    }
  } catch (error) {
    console.error("Error linking expense:", error);
    alert("An error occurred while linking the expense.");
  }
});
