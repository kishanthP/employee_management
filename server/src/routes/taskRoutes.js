const express = require("express");

const router = express.Router();

const taskController = require("../controllers/taskController");

const { verifyToken } = require("../middleware/authMiddleware");

const { isAdmin } = require("../middleware/roleMiddleware");


router.post(
  "/create",
  verifyToken,
  isAdmin,
  taskController.createTask
);

router.get(
  "/my",
  verifyToken,
  taskController.myTasks
);

router.put(
  "/update-status/:id",
  verifyToken,
  taskController.updateStatus
);

router.get(
  "/all",
  verifyToken,
  isAdmin,
  taskController.allTasks
);

module.exports = router;