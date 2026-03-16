const pool = require("../config/db");

// ─── Auth helpers ────────────────────────────────────────────────────────────

const findUserByEmail = async (email) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );
  return result.rows[0];
};

const findById = async (id) => {
  const result = await pool.query(
    "SELECT id, name, email, role, manager_id FROM users WHERE id=$1",
    [id]
  );
  return result.rows[0];
};

// ─── Admin: create / delete / list managers ──────────────────────────────────

const createManager = async (name, email, hashedPassword) => {
  const result = await pool.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, 'manager')
     RETURNING id, name, email, role, created_at`,
    [name, email, hashedPassword]
  );
  return result.rows[0];
};

const deleteUserById = async (id) => {
  const result = await pool.query(
    "DELETE FROM users WHERE id=$1 RETURNING *",
    [id]
  );
  return result.rows[0];
};

const getAllManagers = async () => {
  const result = await pool.query(
    `SELECT id, name, email, role, created_at
     FROM users
     WHERE role='manager'
     ORDER BY created_at DESC`
  );
  return result.rows;
};

const getAllEmployees = async () => {
  const result = await pool.query(
    `SELECT u.id, u.name, u.email, u.role, u.manager_id,
            m.name AS manager_name, u.created_at
     FROM users u
     LEFT JOIN users m ON u.manager_id = m.id
     WHERE u.role='employee'
     ORDER BY u.created_at DESC`
  );
  return result.rows;
};

// ─── Manager: create / delete / list own employees ───────────────────────────

const createEmployee = async (name, email, hashedPassword, managerId) => {
  const result = await pool.query(
    `INSERT INTO users (name, email, password, role, manager_id)
     VALUES ($1, $2, $3, 'employee', $4)
     RETURNING id, name, email, role, manager_id, created_at`,
    [name, email, hashedPassword, managerId]
  );
  return result.rows[0];
};

const getEmployeesByManager = async (managerId) => {
  const result = await pool.query(
    `SELECT id, name, email, role, created_at
     FROM users
     WHERE role='employee' AND manager_id=$1
     ORDER BY created_at DESC`,
    [managerId]
  );
  return result.rows;
};

// ─── Admin: original createUser (for admin signup path) ─────────────────────

const createUser = async (name, email, password) => {
  const result = await pool.query(
    "INSERT INTO users (name,email,password) VALUES ($1,$2,$3) RETURNING *",
    [name, email, password]
  );
  return result.rows[0];
};

module.exports = {
  findUserByEmail,
  findById,
  createUser,
  createManager,
  createEmployee,
  deleteUserById,
  getAllManagers,
  getAllEmployees,
  getEmployeesByManager,
};