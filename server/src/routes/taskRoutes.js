const express = require("express");
const router = express.Router();

const taskController = require("../controllers/taskController");
const { verifyToken } = require("../middleware/authMiddleware");
const { isEmployee, isAdmin } = require("../middleware/roleMiddleware");

// GET  /api/tasks/my                → employee views own tasks
router.get("/my", verifyToken, isEmployee, taskController.myTasks);

// PUT  /api/tasks/update-status/:id → employee updates own task status
router.put(
  "/update-status/:id",
  verifyToken,
  isEmployee,
  taskController.updateStatus
);

// GET  /api/tasks/all               → admin views all tasks
router.get("/all", verifyToken, isAdmin, taskController.allTasks);

module.exports = router;