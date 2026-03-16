const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const taskModel = require("../models/taskModel");
const attendanceModel = require("../models/attendanceModel");
const activityModel = require("../models/activityModel");

// ─── POST /api/manager/employees ─────────────────────────────────────────────
exports.createEmployee = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const managerId = req.user.id;

    const existing = await userModel.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const employee = await userModel.createEmployee(
      name,
      email,
      hashedPassword,
      managerId
    );

    await activityModel.logActivity(
      managerId,
      `Manager created employee: ${name} (${email})`
    );

    res
      .status(201)
      .json({ message: "Employee created successfully", employee });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── DELETE /api/manager/employees/:id ───────────────────────────────────────
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const managerId = req.user.id;

    const user = await userModel.findById(id);

    if (!user || user.role !== "employee") {
      return res.status(404).json({ message: "Employee not found" });
    }

    // A manager can only delete their own employees
    if (String(user.manager_id) !== String(managerId)) {
      return res
        .status(403)
        .json({ message: "You can only delete your own employees" });
    }

    await userModel.deleteUserById(id);

    await activityModel.logActivity(
      managerId,
      `Manager deleted employee: ${user.name} (id:${id})`
    );

    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── GET /api/manager/employees ──────────────────────────────────────────────
exports.getMyEmployees = async (req, res) => {
  try {
    const managerId = req.user.id;
    const employees = await userModel.getEmployeesByManager(managerId);
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── POST /api/manager/tasks ─────────────────────────────────────────────────
exports.assignTask = async (req, res) => {
  try {
    const { title, description, assigned_to, priority, due_date } = req.body;
    const managerId = req.user.id;

    // Verify the employee belongs to this manager
    const employee = await userModel.findById(assigned_to);
    if (
      !employee ||
      employee.role !== "employee" ||
      String(employee.manager_id) !== String(managerId)
    ) {
      return res.status(403).json({
        message: "You can only assign tasks to your own employees",
      });
    }

    const task = await taskModel.createTask(
      title,
      description,
      assigned_to,
      managerId,
      priority,
      due_date
    );

    await activityModel.logActivity(
      managerId,
      `Manager assigned task "${title}" to employee id:${assigned_to}`
    );

    res.status(201).json({ message: "Task assigned successfully", task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── GET /api/manager/tasks ───────────────────────────────────────────────────
exports.getMyTasks = async (req, res) => {
  try {
    const managerId = req.user.id;
    const tasks = await taskModel.getTasksByManager(managerId);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── GET /api/manager/attendance ─────────────────────────────────────────────
exports.getTeamAttendance = async (req, res) => {
  try {
    const managerId = req.user.id;
    const records = await attendanceModel.getAttendanceByManager(managerId);
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
