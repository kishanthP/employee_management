# Employee Management System - Frontend

A modern, responsive dashboard built with React and Material UI for managing organizational workflows with a three-layer hierarchy.

## Overview

This is the client-side application for the Employee Management System (EMS). It features a premium design with role-based navigation and access control for **Admins**, **Managers**, and **Employees**.

### Key Features

-   **Secure Authentication**: Persistent login with JWT and Redux Toolkit.
-   **Role-Based Access Control (RBAC)**: Personalized interfaces and protected routes for each user type.
-   **Dynamic Dashboards**: Real-time stats and quick actions tailored to individual roles.
-   **Attendance Management**: Seamless Check-In/Out system with history tracking.
-   **Task Orchestration**: 
    -   Managers can assign tasks and track live progress.
    -   Employees can view and update their task statuses.
-   **Responsive Design**: Fully optimized for Desktop, Tablet, and Mobile views using MUI Grid and Box systems.

## Tech Stack

-   **Core**: React 18 (Vite)
-   **Styling**: Material UI (MUI) v5
-   **State Management**: Redux Toolkit (with persistence)
-   **Routing**: React Router DOM v6
-   **HTTP Client**: Axios (with Bearer Token interceptors)
-   **Icons**: MUI Icons Material

## Project Structure

```text
client/
├── src/
│   ├── app/            # Redux store configuration
│   ├── components/     # Reusable UI (Layout, Navbar, Sidebar, ProtectedRoute)
│   ├── features/       # Redux slices (Auth, etc.)
│   ├── pages/          # Page components
│   │   ├── admin/      # Admin-only management pages
│   │   ├── manager/    # Manager-only team tools
│   │   └── ...         # Shared pages (Login, Dashboard, Tasks, Attendance)
│   ├── services/       # API configuration (Axios instance)
│   ├── App.jsx         # Root routing and theme provider
│   └── main.jsx        # Entry point
```

## Setup & Installation

1.  **Change Directory**:
    ```bash
    cd client
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Configure API**:
    Ensure the backend is running (usually at `http://localhost:5000`). Update `src/services/api.js` if your backend URL is different.

4.  **Launch**:
    ```bash
    npm run dev
    ```

## Usage Guide

-   **Login**: Use credentials provided by your system administrator.
-   **Navigation**: Use the sidebar to access features specific to your role.
-   **Mobile**: Tap the hamburger menu (if using a responsive variant) to navigate on smaller screens.


color
Dark navy sidebar (#1E2235) — looks premium, easy to navigate
Indigo blue primary (#5B6CF9) — trustworthy and professional, ideal for buttons, active states, and links
Green for attendance (#22C55E) — instantly readable as "present / done"
Amber for tasks (#F59E0B) — signals urgency without alarm
Red for danger (#EF4444) — absent, overdue, alerts