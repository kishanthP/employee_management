import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Attendance from "./pages/Attendance";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Admin Pages
import ManageManagers from "./pages/admin/ManageManagers";
import AllEmployees from "./pages/admin/AllEmployees";
import SystemReports from "./pages/admin/SystemReports";

// Manager Pages
import MyEmployees from "./pages/manager/MyEmployees";
import AssignTask from "./pages/manager/AssignTask";
import ManagerTasks from "./pages/manager/ManagerTasks";
import TeamAttendance from "./pages/manager/TeamAttendance";

function App() {
  const { token } = useSelector((state) => state.auth);

  return (
    <Routes>
      <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Login />} />

      {/* Protected Layout Routes */}
      <Route element={<Layout><ProtectedRoute /></Layout>}>
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Global but restricted by logic inside */}
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/attendance" element={<Attendance />} />

        {/* Admin Only */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/managers" element={<ManageManagers />} />
          <Route path="/admin/employees" element={<AllEmployees />} />
          <Route path="/admin/reports" element={<SystemReports />} />
        </Route>

        {/* Manager Only */}
        <Route element={<ProtectedRoute allowedRoles={["manager"]} />}>
          <Route path="/manager/employees" element={<MyEmployees />} />
          <Route path="/manager/tasks" element={<ManagerTasks />} />
          <Route path="/manager/tasks/new" element={<AssignTask />} />
          <Route path="/manager/attendance" element={<TeamAttendance />} />
        </Route>
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;