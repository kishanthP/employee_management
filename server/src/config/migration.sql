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

-- ─── CHAT & GROUPS MIGRATION (run once) ──────────────────────────────────────

-- 6. Direct message conversations (1-on-1)
CREATE TABLE IF NOT EXISTS conversations (
  id         SERIAL PRIMARY KEY,
  user1_id   INT REFERENCES users(id) ON DELETE CASCADE,
  user2_id   INT REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user1_id, user2_id)
);

-- 7. Group chats (created by managers only)
CREATE TABLE IF NOT EXISTS groups (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  created_by INT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 8. Group members
CREATE TABLE IF NOT EXISTS group_members (
  group_id INT REFERENCES groups(id) ON DELETE CASCADE,
  user_id  INT REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (group_id, user_id)
);

-- 9. All messages (direct + group)
CREATE TABLE IF NOT EXISTS messages (
  id              SERIAL PRIMARY KEY,
  sender_id       INT REFERENCES users(id) ON DELETE SET NULL,
  conversation_id INT REFERENCES conversations(id) ON DELETE CASCADE,
  group_id        INT REFERENCES groups(id) ON DELETE CASCADE,
  content         TEXT NOT NULL,
  type            VARCHAR(20) DEFAULT 'text',
  meeting_room    VARCHAR(200),
  created_at      TIMESTAMP DEFAULT NOW(),
  CHECK (
    (conversation_id IS NOT NULL AND group_id IS NULL) OR
    (group_id IS NOT NULL AND conversation_id IS NULL)
  )
);

-- 10. Per-user message read receipts
CREATE TABLE IF NOT EXISTS message_reads (
  message_id INT REFERENCES messages(id) ON DELETE CASCADE,
  user_id    INT REFERENCES users(id) ON DELETE CASCADE,
  read_at    TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (message_id, user_id)
);
