const express = require("express");
const router = express.Router();

const managerController = require("../controllers/managerController");
const { verifyToken } = require("../middleware/authMiddleware");
const { isManager } = require("../middleware/roleMiddleware");

// All manager routes require a valid token + manager role
router.use(verifyToken, isManager);

// ── Employees ─────────────────────────────────────────────────────────────────
// POST   /api/manager/employees      → create an employee under this manager
router.post("/employees", managerController.createEmployee);

// GET    /api/manager/employees      → list this manager's employees
router.get("/employees", managerController.getMyEmployees);

// DELETE /api/manager/employees/:id  → delete own employee
router.delete("/employees/:id", managerController.deleteEmployee);

// ── Tasks ─────────────────────────────────────────────────────────────────────
// POST   /api/manager/tasks          → assign task to own employee
router.post("/tasks", managerController.assignTask);

// GET    /api/manager/tasks          → view tasks created by this manager
router.get("/tasks", managerController.getMyTasks);

// ── Attendance ────────────────────────────────────────────────────────────────
// GET    /api/manager/attendance     → team attendance
router.get("/attendance", managerController.getTeamAttendance);

module.exports = router;
