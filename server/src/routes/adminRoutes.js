const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const { verifyToken } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware");

// All admin routes require a valid token + admin role
router.use(verifyToken, isAdmin);

// ── Managers ─────────────────────────────────────────────────────────────────
// POST   /api/admin/managers       → create a manager
router.post("/managers", adminController.createManager);

// GET    /api/admin/managers       → list all managers
router.get("/managers", adminController.getAllManagers);

// DELETE /api/admin/managers/:id   → delete a manager
router.delete("/managers/:id", adminController.deleteManager);

// ── Employees ─────────────────────────────────────────────────────────────────
// GET    /api/admin/employees      → list all employees
router.get("/employees", adminController.getAllEmployees);

// ── Reports ──────────────────────────────────────────────────────────────────
// GET    /api/admin/attendance     → full attendance report
router.get("/attendance", adminController.getAttendanceReport);

// GET    /api/admin/activity       → system activity log
router.get("/activity", adminController.getSystemActivity);

module.exports = router;
