// test-expenses-controller.js

import {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} from "./controllers/expenses-controller.js";

// Test: Get All Expenses
async function testGetAllExpenses() {
  try {
    const expenses = await getExpenses();
    console.log("All Expenses:", expenses);
  } catch (err) {
    console.error("Error fetching all expenses:", err);
  }
}

// Test: Get Expense By ID
async function testGetExpenseById(id) {
  try {
    const expense = await getExpenses(id);
    console.log(`Expense with ID ${id}:`, expense);
  } catch (err) {
    console.error(`Error fetching expense with ID ${id}:`, err);
  }
}

// Test: Create Expense
async function testCreateExpense() {
  try {
    const expenseId = await createExpense("Test Expense", "Travel", 100.0);
    console.log("New Expense Created with ID:", expenseId);
    await testGetExpenseById(expenseId); // Fetch the expense just created
  } catch (err) {
    console.error("Error creating expense:", err);
  }
}

// Test: Update Expense
async function testUpdateExpense(id) {
  try {
    const updated = await updateExpense(
      id,
      "Updated Test Expense",
      "materials",
      "2024-12-10",
      150.0,
      1
    );
    if (updated) {
      console.log(`Expense with ID ${id} updated.`);
      await testGetExpenseById(id); // Fetch updated expense
    } else {
      console.log(`Expense with ID ${id} not found for update.`);
    }
  } catch (err) {
    console.error(`Error updating expense with ID ${id}:`, err);
  }
}

// Test: Delete Expense
async function testDeleteExpense(id) {
  try {
    const deleted = await deleteExpense(id);
    if (deleted) {
      console.log(`Expense with ID ${id} was deleted.`);
    } else {
      console.log(`Expense with ID ${id} was not found for deletion.`);
    }
  } catch (err) {
    console.error(`Error deleting expense with ID ${id}:`, err);
  }
}

async function runTests() {
  // Create a new expense for testing other CRUD operations
  // await testCreateExpense();

  // Test getting all expenses
  await testGetAllExpenses();

  // Test specific expense fetch, update, and delete
  const expenseId = 4; // Replace with actual expense ID after creation
  // await testGetExpenseById(expenseId);
  // await testUpdateExpense(expenseId);
  // await testDeleteExpense(expenseId);
}

// Start testing
runTests();
