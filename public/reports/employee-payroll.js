const API_URL = "http://localhost:3000/payroll-report";
const payrollForm = document.getElementById("payrollReportForm");
const payrollDetailsDiv = document.getElementById("payrollDetails");
const errorMessageDiv = document.getElementById("error-message");

payrollForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const year = document.getElementById("year").value;
  const month = document.getElementById("month").value;

  if (!year || !month) {
    alert("Year and Month are required");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${year}/${month}`);

    const data = await response.json();

    if (response.ok) {
      const payrollList = document.getElementById("payrollList");
      payrollList.innerHTML = "";
      data.payrollRecords.forEach((record) => {
        const listItem = document.createElement("li");
        listItem.innerText = `Employee ID: ${record.emp_id}, Expense: ${record.payroll_expense}`;
        payrollList.appendChild(listItem);
      });

      document.getElementById("totalPayroll").innerText = data.totalPayroll;
      payrollDetailsDiv.style.display = "block";
      errorMessageDiv.style.display = "none";
    } else {
      payrollDetailsDiv.style.display = "none";
      errorMessageDiv.style.display = "block";
    }
  } catch (error) {
    console.error("Error generating payroll report:", error);
    errorMessageDiv.style.display = "block";
    payrollDetailsDiv.style.display = "none";
  }
});
