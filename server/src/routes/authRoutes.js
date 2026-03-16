const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

// POST /api/auth/login – all roles
router.post("/login", authController.login);

// POST /api/auth/admin/signup – bootstrap first admin (protect in production)
router.post("/admin/signup", authController.adminSignup);

module.exports = router;