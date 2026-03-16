# Employee Management System — Server Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Roles & Permissions](#roles--permissions)
5. [Database Schema](#database-schema)
6. [Setup & Installation](#setup--installation)
7. [Environment Variables](#environment-variables)
8. [API Reference](#api-reference)
   - [Auth](#auth-routes)
   - [Admin](#admin-routes)
   - [Manager](#manager-routes)
   - [Attendance](#attendance-routes)
   - [Tasks](#task-routes)
9. [Middleware](#middleware)
10. [Error Handling](#error-handling)

---

## Project Overview

A RESTful backend API for an **Employee Management System** built with Node.js, Express, and PostgreSQL. It supports three distinct roles:

| Role | Responsibility |
|------|---------------|
| **Admin** | System control — manage managers, view all data, system activity |
| **Manager** | Team control — manage employees, assign tasks, view team data |
| **Employee** | Self-service — attendance check-in/out, view & update own tasks |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | PostgreSQL |
| ORM | Raw SQL via `pg` (node-postgres) |
| Authentication | JWT (`jsonwebtoken`) |
| Password Hashing | `bcrypt` |
| Config | `dotenv` |

---

## Project Structure

```
server/
├── .env                        # Environment variables
├── package.json
└── src/
    ├── app.js                  # Express app entry point
    ├── config/
    │   ├── db.js               # PostgreSQL pool connection
    │   └── migration.sql       # DB schema setup (run once)
    ├── middleware/
    │   ├── authMiddleware.js   # JWT verification (verifyToken)
    │   └── roleMiddleware.js   # Role guards (isAdmin, isManager, isEmployee, isAdminOrManager)
    ├── models/
    │   ├── userModel.js        # User queries (create, find, delete, list by role)
    │   ├── attendanceModel.js  # Attendance queries
    │   ├── taskModel.js        # Task queries
    │   └── activityModel.js    # System activity log queries
    ├── controllers/
    │   ├── authController.js   # Login, admin bootstrap signup
    │   ├── adminController.js  # Admin operations
    │   ├── managerController.js# Manager operations
    │   ├── attendanceController.js
    │   └── taskController.js
    └── routes/
        ├── authRoutes.js       # /api/auth/*
        ├── adminRoutes.js      # /api/admin/*
        ├── managerRoutes.js    # /api/manager/*
        ├── attendanceRoutes.js # /api/attendance/*
        └── taskRoutes.js       # /api/tasks/*
```

---

## Roles & Permissions

```
Admin
 ├── Create / Delete / List Managers
 ├── View All Employees
 ├── View Full Attendance Report
 └── View System Activity Log

Manager
 ├── Create / Delete / List Own Employees
 ├── Assign Tasks to Own Employees
 ├── View All Tasks They Created
 └── View Own Team's Attendance

Employee
 ├── Check-In & Check-Out
 ├── View Own Attendance History
 ├── View Assigned Tasks
 └── Update Task Status (pending → in_progress → completed)
```

> **Security:** A manager can only manage employees assigned to them. Assigning a task to an employee from another manager's team is rejected with `403 Forbidden`.

---

## Database Schema

### `users`
| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL PK | Auto-increment ID |
| `name` | VARCHAR(100) | Full name |
| `email` | VARCHAR(100) UNIQUE | Login email |
| `password` | TEXT | Bcrypt hashed password |
| `role` | VARCHAR(20) | `admin` / `manager` / `employee` |
| `manager_id` | INT FK → users.id | Links employee to their manager |
| `created_at` | TIMESTAMP | Record creation time |

### `tasks`
| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL PK | |
| `title` | VARCHAR(200) | Task title |
| `description` | TEXT | Task details |
| `assigned_to` | INT FK → users.id | Employee assigned |
| `created_by` | INT FK → users.id | Manager who created it |
| `priority` | VARCHAR(20) | `low` / `medium` / `high` |
| `status` | VARCHAR(30) | `pending` / `in_progress` / `completed` |
| `due_date` | DATE | Deadline |
| `created_at` | TIMESTAMP | |

### `attendance`
| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL PK | |
| `user_id` | INT FK → users.id | Employee |
| `date` | DATE | Attendance date |
| `check_in` | TIMESTAMP | Check-in timestamp |
| `check_out` | TIMESTAMP | Check-out timestamp |
| `total_hours` | NUMERIC(5,2) | Hours worked (auto-calculated) |
| `created_at` | TIMESTAMP | |

### `activity_logs`
| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL PK | |
| `user_id` | INT FK → users.id | Who performed the action |
| `action` | TEXT | Description of the action |
| `created_at` | TIMESTAMP | When it happened |

---

## Setup & Installation

### 1. Install dependencies
```bash
cd server
npm install
```

### 2. Configure environment variables
Copy and edit `.env`:
```bash
PORT=5000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=employee_management_system
DB_PASSWORD=your_password
DB_PORT=5432
JWT_SECRET=your_secret_key
```

### 3. Set up the database
Open **pgAdmin** or **psql** and run:
```sql
-- Create the database first
CREATE DATABASE employee_management_system;

-- Then run the migration file
\i src/config/migration.sql
```

### 4. Create the first Admin
```bash
# Start server
npm run dev   # or: node src/app.js

# POST request to bootstrap admin
POST http://localhost:5000/api/auth/admin/signup
Body: { "name": "Super Admin", "email": "admin@company.com", "password": "Admin@123" }
```

### 5. Login & get token
```
POST http://localhost:5000/api/auth/login
Body: { "email": "admin@company.com", "password": "Admin@123" }
```
All subsequent requests need the header:
```
Authorization: Bearer <token>
```

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `DB_USER` | PostgreSQL username | `postgres` |
| `DB_HOST` | DB host | `localhost` |
| `DB_NAME` | Database name | `employee_management_system` |
| `DB_PASSWORD` | DB password | `yourpassword` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `JWT_SECRET` | Secret for JWT signing | `mysecretkey` |

---

## API Reference

### Auth Routes
**Base:** `/api/auth` — No authentication needed

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/login` | `{ email, password }` | Login (all roles) → returns JWT token + user info |
| POST | `/admin/signup` | `{ name, email, password }` | Create first admin (bootstrap only) |

**Login Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1...",
  "user": {
    "id": 1,
    "name": "Super Admin",
    "email": "admin@company.com",
    "role": "admin"
  }
}
```

---

### Admin Routes
**Base:** `/api/admin` — Requires `Authorization: Bearer <admin-token>`

#### Managers

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/managers` | `{ name, email, password }` | Create a new manager |
| GET | `/managers` | — | List all managers |
| DELETE | `/managers/:id` | — | Delete a manager by ID |

**Create Manager — Request:**
```json
POST /api/admin/managers
{
  "name": "John Manager",
  "email": "john@company.com",
  "password": "Manager@123"
}
```
**Response:**
```json
{
  "message": "Manager created successfully",
  "manager": {
    "id": 2,
    "name": "John Manager",
    "email": "john@company.com",
    "role": "manager",
    "created_at": "2026-03-15T06:00:00.000Z"
  }
}
```

#### Employees

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/employees` | View all employees with their manager's name |

#### Reports

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/attendance` | Full attendance report (all employees, all dates) |
| GET | `/activity` | System activity log (who did what and when) |

---

### Manager Routes
**Base:** `/api/manager` — Requires `Authorization: Bearer <manager-token>`

#### Employees

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/employees` | `{ name, email, password }` | Create an employee under this manager |
| GET | `/employees` | — | List this manager's employees |
| DELETE | `/employees/:id` | — | Delete own employee (ownership validated) |

**Create Employee — Request:**
```json
POST /api/manager/employees
{
  "name": "Alice Employee",
  "email": "alice@company.com",
  "password": "Employee@123"
}
```

#### Tasks

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/tasks` | `{ title, description, assigned_to, priority, due_date }` | Assign a task to an employee |
| GET | `/tasks` | — | List all tasks created by this manager |

**Assign Task — Request:**
```json
POST /api/manager/tasks
{
  "title": "Build login page",
  "description": "Create login UI with validation",
  "assigned_to": 3,
  "priority": "high",
  "due_date": "2026-03-20"
}
```

#### Attendance

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/attendance` | View attendance records for all employees in this manager's team |

---

### Attendance Routes
**Base:** `/api/attendance`

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/checkin` | Employee | Record check-in (once per day) |
| POST | `/checkout` | Employee | Record check-out & auto-calculate total hours |
| GET | `/my` | Employee | View own attendance history |
| GET | `/all` | Admin | View all employees' attendance |

**Check-In Response:**
```json
{
  "message": "Check-in successful",
  "attendance": {
    "id": 10,
    "user_id": 3,
    "date": "2026-03-15",
    "check_in": "2026-03-15T03:30:00.000Z",
    "check_out": null,
    "total_hours": null
  }
}
```

**Check-Out Response:**
```json
{
  "message": "Check-out successful",
  "attendance": {
    "id": 10,
    "user_id": 3,
    "date": "2026-03-15",
    "check_in": "2026-03-15T03:30:00.000Z",
    "check_out": "2026-03-15T11:30:00.000Z",
    "total_hours": "8.00"
  }
}
```

---

### Task Routes
**Base:** `/api/tasks`

| Method | Endpoint | Role | Body | Description |
|--------|----------|------|------|-------------|
| GET | `/my` | Employee | — | View all tasks assigned to me |
| PUT | `/update-status/:id` | Employee | `{ status }` | Update task status |
| GET | `/all` | Admin | — | View all tasks system-wide |

**Valid status values:** `pending` · `in_progress` · `completed`

**Update Status — Request:**
```json
PUT /api/tasks/update-status/5
{
  "status": "in_progress"
}
```

---

## Middleware

### `authMiddleware.js` — `verifyToken`
Validates the JWT from `Authorization: Bearer <token>` header.  
Attaches `req.user = { id, role }` for downstream use.

```
Request → verifyToken → req.user populated → next()
                     → 401 if token missing or invalid
```

### `roleMiddleware.js`

| Guard | Allows | Rejects with |
|-------|--------|-------------|
| `isAdmin` | `admin` | 403 |
| `isManager` | `manager` | 403 |
| `isEmployee` | `employee` | 403 |
| `isAdminOrManager` | `admin` or `manager` | 403 |

---

## Error Handling

All endpoints follow a consistent error response format:

**Success (2xx):**
```json
{ "message": "...", "data": { ... } }
```

**Client Error (4xx):**
```json
{ "message": "Descriptive error message" }
```

**Server Error (500):**
```json
{ "error": "error.message from try/catch" }
```

**Common HTTP Status Codes:**
| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request (validation error, duplicate email, etc.) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (wrong role) |
| 404 | Not Found |
| 500 | Internal Server Error |


**postman checking**
Verification Plan
Manual API Testing (use Postman or Thunder Client)
Admin login → POST /api/auth/login with admin credentials → get token
Create manager → POST /api/admin/managers (admin token) → 201
List managers → GET /api/admin/managers (admin token) → array
Manager login → POST /api/auth/login with manager credentials → get token
Create employee → POST /api/manager/employees (manager token) → 201
Assign task → POST /api/manager/tasks (manager token, employee id) → task created
Employee login → POST /api/auth/login → get token
Check-in → POST /api/attendance/checkin (employee token) → success
View tasks → GET /api/tasks/my (employee token) → list
Update task → PUT /api/tasks/update-status/:id (employee token) → updated
Role guard test → POST /api/admin/managers with employee token → 403