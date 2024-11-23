import express from "express";

import tasksRouter from "./routes/records/tasks-routes.js";
import projectsRouter from "./routes/records/projects-routes.js";
import expensesRouter from "./routes/records/expenses-routes.js";
import employeesRouter from "./routes/records/employees-routes.js";

import taskCompletionRouter from "./routes/transactions/task-completion-routes.js";
import bonusCalculationRouter from "./routes/transactions/bonus-calculation-routes.js";
import expensesComputationRouter from "./routes/transactions/expenses-computation-routes.js";
import taskAssignmentRouter from "./routes/transactions/task-assignment-routes.js";

import projectProgressReportRouter from "./routes/reports/project-progress-routes.js";
import financialSummaryReportRouter from "./routes/reports/financial-summary-routes.js";
import taskCompletionReportRouter from "./routes/reports/task-completion-report-routes.js";
import payrollReportRouter from "./routes/reports/payroll-report-routes.js";

import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "public")));

app.use("/tasks", tasksRouter);
app.use("/projects", projectsRouter);
app.use("/expenses", expensesRouter);
app.use("/employees", employeesRouter);

app.use("/task-completion", taskCompletionRouter);
app.use("/bonus-calculation", bonusCalculationRouter);
app.use("/expenses-computation", expensesComputationRouter);
app.use("/task-assignment", taskAssignmentRouter);

app.use("/project-progress-report", projectProgressReportRouter);
app.use("/financial-summary-report", financialSummaryReportRouter);
app.use("/task-completion-report", taskCompletionReportRouter);
app.use("/payroll-report", payrollReportRouter);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
