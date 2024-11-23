const API_URL = "http://localhost:3000/expenses";

const addExpenseName = document.getElementById("add-expense-name");
const addExpenseType = document.getElementById("add-expense-type");
const addExpenseDate = document.getElementById("add-expense-date");
const addExpenseCost = document.getElementById("add-expense-cost");
const addExpenseProjectId = document.getElementById("add-expense-project-id");

const editExpenseName = document.getElementById("edit-expense-name");
const editExpenseType = document.getElementById("edit-expense-type");
const editExpenseDate = document.getElementById("edit-expense-date");
const editExpenseCost = document.getElementById("edit-expense-cost");
const editExpenseProjectId = document.getElementById("edit-expense-project-id");

const expenseTable = document.getElementById("expense-table");
const searchBar = document.getElementById("search-expense-bar");

const addForm = document.getElementById("add-expense-form");
const editForm = document.getElementById("edit-expense-form");

let expenses = [];
let editExpenseId = null;

async function fetchExpenses() {
  try {
    const res = await fetch(API_URL);
    expenses = await res.json();
    populateTable(expenses);
  } catch (err) {
    console.error("Error fetching expenses:", err);
  }
}

function populateTable(expenses) {
  expenseTable.innerHTML = expenses
    .map(
      (expense) => `
    <tr>
      <td>${expense.expense_id}</td>
      <td>${expense.expense_name}</td>
      <td>${expense.expense_type}</td>
      <td>${expense.expense_date || "N/A"}</td>
      <td>${expense.cost}</td>
      <td>${expense.project_id || "N/A"}</td>
      <td>
        <button onclick="editExpense(${expense.expense_id})">Edit</button>
        <button onclick="deleteExpense(${expense.expense_id})">Delete</button>
      </td>
    </tr>
  `
    )
    .join("");
}

function searchExpenses() {
  const query = searchBar.value.toLowerCase();
  const filteredExpenses = expenses.filter((expense) =>
    expense.expense_name.toLowerCase().includes(query)
  );
  populateTable(filteredExpenses);
}

async function deleteExpense(id) {
  if (confirm("Are you sure you want to delete this expense?")) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchExpenses();
  }
}

function openAddExpenseForm() {
  closeEditExpenseForm();
  addForm.style.display = "block";
}

function closeAddExpenseForm() {
  addForm.style.display = "none";
}

function openEditExpenseForm() {
  closeAddExpenseForm();
  editForm.style.display = "block";
}

function closeEditExpenseForm() {
  editForm.style.display = "none";
  editExpenseId = null;
}

addForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newExpense = {
    expense_name: addExpenseName.value,
    expense_type: addExpenseType.value,
    cost: parseFloat(addExpenseCost.value),
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newExpense),
    });

    if (response.ok) {
      alert("Expense added successfully!");
      addForm.style.display = "none";
      fetchExpenses();
    } else {
      alert("Failed to add expense. Please check the server.");
    }
  } catch (err) {
    console.error("Error adding expense:", err);
    alert("Error: Could not connect to the server.");
  }
});

function editExpense(id) {
  const expense = expenses.find((expense) => expense.expense_id === id);
  if (!expense) return;

  editExpenseId = id;
  editExpenseName.value = expense.expense_name;
  editExpenseType.value = expense.expense_type;
  editExpenseDate.value = expense.expense_date || "";
  editExpenseCost.value = expense.cost;
  editExpenseProjectId.value = expense.project_id || "";

  openEditExpenseForm();
}

editForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const updatedExpense = {
    expense_name: editExpenseName.value,
    expense_type: editExpenseType.value,
    expense_date: editExpenseDate.value || null,
    cost: parseFloat(editExpenseCost.value),
    project_id: parseInt(editExpenseProjectId.value) || null,
  };

  try {
    const response = await fetch(`${API_URL}/${editExpenseId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedExpense),
    });

    if (response.ok) {
      alert("Expense updated successfully!");
      editForm.style.display = "none";
      fetchExpenses();
    } else {
      alert("Failed to update expense. Please check the server.");
    }
  } catch (err) {
    console.error("Error updating expense:", err);
    alert("Error: Could not connect to the server.");
  }
});

fetchExpenses();
