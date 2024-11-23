const API_URL = "http://localhost:3000/financial-summary";
const summaryForm = document.getElementById("financialSummaryForm");
const financialSummaryDetailsDiv = document.getElementById(
  "financialSummaryDetails"
);
const errorMessageDiv = document.getElementById("error-message");

summaryForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  try {
    const response = await fetch(API_URL);

    const data = await response.json();

    if (response.ok) {
      const summaryList = document.getElementById("financialSummaryList");
      summaryList.innerHTML = "";
      data.forEach((summary) => {
        const listItem = document.createElement("li");
        listItem.innerText = `${summary.project_name} - ${summary.month}, ${summary.year} - Total Expenses: ${summary.total_expenses}, Remaining Budget: ${summary.remaining_budget}`;
        summaryList.appendChild(listItem);
      });

      financialSummaryDetailsDiv.style.display = "block";
      errorMessageDiv.style.display = "none";
    } else {
      financialSummaryDetailsDiv.style.display = "none";
      errorMessageDiv.style.display = "block";
    }
  } catch (error) {
    console.error("Error generating financial summary:", error);
    errorMessageDiv.style.display = "block";
    financialSummaryDetailsDiv.style.display = "none";
  }
});
