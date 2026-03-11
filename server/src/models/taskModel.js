const pool = require("../config/db");

const createTask = async (
  title,
  description,
  assignedTo,
  createdBy,
  priority,
  dueDate
) => {

  const result = await pool.query(
    `INSERT INTO tasks
    (title, description, assigned_to, created_by, priority, due_date)
    VALUES ($1,$2,$3,$4,$5,$6)
    RETURNING *`,
    [title, description, assignedTo, createdBy, priority, dueDate]
  );

  return result.rows[0];
};

const getMyTasks = async (userId) => {

  const result = await pool.query(
    `SELECT * FROM tasks
     WHERE assigned_to=$1
     ORDER BY created_at DESC`,
    [userId]
  );

  return result.rows;
};

const updateTaskStatus = async (taskId, status) => {

  const result = await pool.query(
    `UPDATE tasks
     SET status=$1
     WHERE id=$2
     RETURNING *`,
    [status, taskId]
  );

  return result.rows[0];
};

const getAllTasks = async () => {

  const result = await pool.query(
    `SELECT t.*, u.name AS employee_name
     FROM tasks t
     JOIN users u
     ON t.assigned_to = u.id
     ORDER BY t.created_at DESC`
  );

  return result.rows;
};

module.exports = {
  createTask,
  getMyTasks,
  updateTaskStatus,
  getAllTasks
};