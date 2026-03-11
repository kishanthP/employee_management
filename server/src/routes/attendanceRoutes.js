const express = require("express");
const router = express.Router();

const attendanceController = require("../controllers/attendanceController");

const { verifyToken } = require("../middleware/authMiddleware");

const { isAdmin } = require("../middleware/roleMiddleware");

router.post("/checkin", verifyToken, attendanceController.checkIn);

router.post("/checkout", verifyToken, attendanceController.checkOut);

router.get("/my", verifyToken, attendanceController.myAttendance);

router.get("/all", verifyToken, isAdmin, attendanceController.allAttendance);

module.exports = router;