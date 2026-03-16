const pool = require("../config/db");

const logActivity = async (userId, action) => {
  await pool.query(
    `INSERT INTO activity_logs (user_id, action)
     VALUES ($1, $2)`,
    [userId, action]
  );
};

const getAllActivity = async () => {
  const result = await pool.query(
    `SELECT al.*, u.name AS user_name, u.role
     FROM activity_logs al
     LEFT JOIN users u ON al.user_id = u.id
     ORDER BY al.created_at DESC`
  );
  return result.rows;
};

module.exports = {
  logActivity,
  getAllActivity,
};
