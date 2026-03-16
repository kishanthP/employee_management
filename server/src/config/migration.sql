-- Run this script once in your PostgreSQL database

-- 1. Create users table (if not exists) with role and manager_id
CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(100) UNIQUE NOT NULL,
  password   TEXT NOT NULL,
  role       VARCHAR(20) NOT NULL DEFAULT 'employee',
  manager_id INT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Add manager_id column if table already exists (skip if already present)
ALTER TABLE users ADD COLUMN IF NOT EXISTS manager_id INT REFERENCES users(id) ON DELETE SET NULL;

-- 3. Create tasks table (if not exists)
CREATE TABLE IF NOT EXISTS tasks (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(200) NOT NULL,
  description TEXT,
  assigned_to INT REFERENCES users(id) ON DELETE CASCADE,
  created_by  INT REFERENCES users(id) ON DELETE SET NULL,
  priority    VARCHAR(20) DEFAULT 'medium',
  status      VARCHAR(30) DEFAULT 'pending',
  due_date    DATE,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- 4. Create attendance table (if not exists)
CREATE TABLE IF NOT EXISTS attendance (
  id          SERIAL PRIMARY KEY,
  user_id     INT REFERENCES users(id) ON DELETE CASCADE,
  date        DATE NOT NULL,
  check_in    TIMESTAMP,
  check_out   TIMESTAMP,
  total_hours NUMERIC(5,2),
  created_at  TIMESTAMP DEFAULT NOW()
);

-- 5. Create activity_logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id         SERIAL PRIMARY KEY,
  user_id    INT REFERENCES users(id) ON DELETE SET NULL,
  action     TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
