const attendanceModel = require("../models/attendanceModel");

// ─── POST /api/attendance/checkin (employee) ──────────────────────────────────
exports.checkIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split("T")[0];
    const now = new Date();

    const existing = await attendanceModel.findTodayAttendance(userId, today);
    if (existing) {
      return res.status(400).json({ message: "Already checked in today" });
    }

    const attendance = await attendanceModel.createCheckIn(userId, today, now);

    res.json({ message: "Check-in successful", attendance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── POST /api/attendance/checkout (employee) ─────────────────────────────────
exports.checkOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split("T")[0];
    const now = new Date();

    const record = await attendanceModel.findTodayAttendance(userId, today);
    if (!record) {
      return res.status(400).json({ message: "No check-in found for today" });
    }

    if (record.check_out) {
      return res.status(400).json({ message: "Already checked out today" });
    }

    const checkInTime = new Date(record.check_in);
    const diffMs = now - checkInTime;
    const totalHours = (diffMs / (1000 * 60 * 60)).toFixed(2);

    const updated = await attendanceModel.updateCheckOut(
      record.id,
      now,
      totalHours
    );

    res.json({ message: "Check-out successful", attendance: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── GET /api/attendance/my (employee) ───────────────────────────────────────
exports.myAttendance = async (req, res) => {
  try {
    const userId = req.user.id;
    const records = await attendanceModel.getUserAttendance(userId);
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── GET /api/attendance/all (admin) ─────────────────────────────────────────
exports.allAttendance = async (req, res) => {
  try {
    const records = await attendanceModel.getAllAttendance();
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
