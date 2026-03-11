require("dotenv").config();
const pool = require("./config/db");

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const { verifyToken } = require("./middleware/authMiddleware");
const attendanceRoutes = require("./routes/attendanceRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/attendance", attendanceRoutes);

app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("Server Running");
});

app.get("/test-db", async (req, res) => {
  try {

    const result = await pool.query("SELECT NOW()");

    res.json({
      message: "Database connected",
      time: result.rows[0]
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
});

app.get("/protected", verifyToken, (req, res) => {

  res.json({
    message: "Protected route working",
    user: req.user
  });

});

app.listen(process.env.PORT, () => {
  console.log("Server running on port", process.env.PORT);
});