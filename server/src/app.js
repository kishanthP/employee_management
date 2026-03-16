require("dotenv").config();
const pool = require("./config/db");

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const managerRoutes = require("./routes/managerRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// ── Public routes ─────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);

// ── Role-protected routes ─────────────────────────────────────────────────────
app.use("/api/admin", adminRoutes);         // admin only
app.use("/api/manager", managerRoutes);     // manager only
app.use("/api/attendance", attendanceRoutes); // employee (checkin/out/my) + admin (all)
app.use("/api/tasks", taskRoutes);          // employee (my/update) + admin (all)

// ── Utility routes ────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.send("Employee Management Server Running");
});

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ message: "Database connected", time: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});