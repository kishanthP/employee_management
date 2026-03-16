const pool = require("../config/db");

const findTodayAttendance = async (userId, date) => {
  const result = await pool.query(
    "SELECT * FROM attendance WHERE user_id = $1 AND date = $2",
    [userId, date]
  );
  return result.rows[0];
};

const createCheckIn = async (userId, date, checkInTime) => {
  const result = await pool.query(
    `INSERT INTO attendance (user_id, date, check_in)
     VALUES ($1,$2,$3)
     RETURNING *`,
    [userId, date, checkInTime]
  );
  return result.rows[0];
};

const updateCheckOut = async (attendanceId, checkOutTime, totalHours) => {
  const result = await pool.query(
    `UPDATE attendance
     SET check_out = $1,
         total_hours = $2
     WHERE id = $3
     RETURNING *`,
    [checkOutTime, totalHours, attendanceId]
  );
  return result.rows[0];
};

const getUserAttendance = async (userId) => {
  const result = await pool.query(
    "SELECT * FROM attendance WHERE user_id=$1 ORDER BY date DESC",
    [userId]
  );
  return result.rows;
};

// Admin: all employees' attendance
const getAllAttendance = async () => {
  const result = await pool.query(
    `SELECT a.*, u.name, u.role
     FROM attendance a
     JOIN users u ON a.user_id = u.id
     ORDER BY date DESC`
  );
  return result.rows;
};

// Manager: attendance of employees under this manager
const getAttendanceByManager = async (managerId) => {
  const result = await pool.query(
    `SELECT a.*, u.name AS employee_name
     FROM attendance a
     JOIN users u ON a.user_id = u.id
     WHERE u.manager_id = $1
     ORDER BY a.date DESC`,
    [managerId]
  );
  return result.rows;
};

module.exports = {
  findTodayAttendance,
  createCheckIn,
  updateCheckOut,
  getUserAttendance,
  getAllAttendance,
  getAttendanceByManager,
};