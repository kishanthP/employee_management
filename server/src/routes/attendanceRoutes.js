const express = require("express");
const router = express.Router();

const attendanceController = require("../controllers/attendanceController");
const { verifyToken } = require("../middleware/authMiddleware");
const { isEmployee, isAdmin } = require("../middleware/roleMiddleware");

// POST /api/attendance/checkin   → employee only
router.post("/checkin", verifyToken, isEmployee, attendanceController.checkIn);

// POST /api/attendance/checkout  → employee only
router.post("/checkout", verifyToken, isEmployee, attendanceController.checkOut);

// GET  /api/attendance/my        → employee views own records
router.get("/my", verifyToken, isEmployee, attendanceController.myAttendance);

// GET  /api/attendance/all       → admin views all records
router.get("/all", verifyToken, isAdmin, attendanceController.allAttendance);

module.exports = router;