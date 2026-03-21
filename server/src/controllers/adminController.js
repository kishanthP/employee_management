const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const activityModel = require("../models/activityModel");
const attendanceModel = require("../models/attendanceModel");

// ─── POST /api/admin/managers ────────────────────────────────────────────────
exports.createManager = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await userModel.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const manager = await userModel.createManager(name, email, hashedPassword);

    await activityModel.logActivity(
      req.user.id,
      `Admin created manager: ${name} (${email})`
    );

    res.status(201).json({ message: "Manager created successfully", manager });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── DELETE /api/admin/managers/:id ─────────────────────────────────────────
exports.deleteManager = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userModel.findById(id);
    if (!user || user.role !== "manager") {
      return res.status(404).json({ message: "Manager not found" });
    }

    await userModel.deleteUserById(id);

    await activityModel.logActivity(
      req.user.id,
      `Admin deleted manager: ${user.name} (id:${id})`
    );

    res.json({ message: "Manager deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── PUT /api/admin/managers/:id ────────────────────────────────────────────
exports.updateManager = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const user = await userModel.findById(id);
    if (!user || user.role !== "manager") {
      return res.status(404).json({ message: "Manager not found" });
    }

    if (email && email !== user.email) {
      const existing = await userModel.findUserByEmail(email);
      if (existing) {
        return res.status(400).json({ message: "Email already registered" });
      }
    }

    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const updatedManager = await userModel.updateUser(id, name, email, hashedPassword);

    await activityModel.logActivity(
      req.user.id,
      `Admin updated manager: ${updatedManager.name} (${updatedManager.email})`
    );

    res.json({ message: "Manager updated successfully", manager: updatedManager });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── GET /api/admin/managers ─────────────────────────────────────────────────
exports.getAllManagers = async (req, res) => {
  try {
    const managers = await userModel.getAllManagers();
    res.json(managers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── GET /api/admin/employees ────────────────────────────────────────────────
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await userModel.getAllEmployees();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── GET /api/admin/attendance ───────────────────────────────────────────────
exports.getAttendanceReport = async (req, res) => {
  try {
    const records = await attendanceModel.getAllAttendance();
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── GET /api/admin/activity ─────────────────────────────────────────────────
exports.getSystemActivity = async (req, res) => {
  try {
    const logs = await activityModel.getAllActivity();
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
