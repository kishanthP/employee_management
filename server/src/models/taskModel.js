const pool = require("../config/db");

// Manager creates task for one of their employees
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

// Employee: view own tasks
const getMyTasks = async (userId) => {
  const result = await pool.query(
    `SELECT t.*, u.name AS assigned_by
     FROM tasks t
     LEFT JOIN users u ON t.created_by = u.id
     WHERE t.assigned_to = $1
     ORDER BY t.created_at DESC`,
    [userId]
  );
  return result.rows;
};

// Employee: update own task status
const updateTaskStatus = async (taskId, status, userId) => {
  const result = await pool.query(
    `UPDATE tasks
     SET status = $1
     WHERE id = $2 AND assigned_to = $3
     RETURNING *`,
    [status, taskId, userId]
  );
  return result.rows[0];
};

// Manager: view tasks they created
const getTasksByManager = async (managerId) => {
  const result = await pool.query(
    `SELECT t.*, u.name AS employee_name
     FROM tasks t
     JOIN users u ON t.assigned_to = u.id
     WHERE t.created_by = $1
     ORDER BY t.created_at DESC`,
    [managerId]
  );
  return result.rows;
};

// Admin: view all tasks
const getAllTasks = async () => {
  const result = await pool.query(
    `SELECT t.*,
            emp.name AS employee_name,
            mgr.name AS manager_name
     FROM tasks t
     JOIN users emp ON t.assigned_to = emp.id
     LEFT JOIN users mgr ON t.created_by = mgr.id
     ORDER BY t.created_at DESC`
  );
  return result.rows;
};

module.exports = {
  createTask,
  getMyTasks,
  updateTaskStatus,
  getTasksByManager,
  getAllTasks,
};