const { Pool } = require("pg");
require("dotenv").config();

// Enable SSL for RDS/Aurora (required for AWS connections)
const isRDS = process.env.DB_HOST && !process.env.DB_HOST.includes("localhost");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: isRDS ? { rejectUnauthorized: false } : false,
});

module.exports = pool;