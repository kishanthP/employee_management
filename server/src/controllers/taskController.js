const taskModel = require("../models/taskModel");

// ─── GET /api/tasks/my (employee) ─────────────────────────────────────────────
exports.myTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const tasks = await taskModel.getMyTasks(userId);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── PUT /api/tasks/update-status/:id (employee) ─────────────────────────────
// Employee can only update status of tasks assigned to them
exports.updateStatus = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;
    const { status } = req.body;

    const validStatuses = ["pending", "in_progress", "completed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Allowed: ${validStatuses.join(", ")}`,
      });
    }

    const task = await taskModel.updateTaskStatus(taskId, status, userId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found or not assigned to you",
      });
    }

    res.json({ message: "Task status updated", task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── GET /api/tasks/all (admin) ───────────────────────────────────────────────
exports.allTasks = async (req, res) => {
  try {
    const tasks = await taskModel.getAllTasks();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};