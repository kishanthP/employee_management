import { useEffect, useState } from "react";
import { Grid, Paper, Typography, Box, Button, Card, CardContent, Divider } from "@mui/material";
import { useSelector } from "react-redux";
import adminService from "../services/adminService";
import managerService from "../services/managerService";
import taskService from "../services/taskService";
import attendanceService from "../services/attendanceService";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PeopleIcon from "@mui/icons-material/People";
import { Link } from "react-router-dom";

function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        if (user.role === "admin") {
          const [managers, employees, tasks] = await Promise.all([
            adminService.getManagers(),
            adminService.getAllEmployees(),
            taskService.getAllTasks(),
          ]);
          setStats({
            managers: managers.length,
            employees: employees.length,
            tasks: tasks.length,
          });
        } else if (user.role === "manager") {
          const [employees, tasks] = await Promise.all([
            managerService.getTeamEmployees(),
            managerService.getTeamTasks(),
          ]);
          setStats({
            employees: employees.length,
            tasks: tasks.length,
          });
        } else {
          const [tasks, attendance] = await Promise.all([
            taskService.getMyTasks(),
            attendanceService.getMyAttendance(),
          ]);
          setStats({
            tasks: tasks.length,
            attendance: attendance.length,
          });
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ height: "100%", display: "flex", alignItems: "center", p: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: 60, height: 60, borderRadius: "50%", bgcolor: `${color}.light`, color: `${color}.main`, mr: 2 }}>
        {icon}
      </Box>
      <CardContent sx={{ p: "0 !important" }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Welcome back, {user.name}
      </Typography>

      <Grid container spacing={3}>
        {user.role === "admin" && (
          <>
            <Grid size={{xs: 12, sm: 4}}>
              <StatCard title="Total Managers" value={stats?.managers || 0} icon={<PeopleIcon />} color="primary" />
            </Grid>
            <Grid size={{xs: 12, sm: 4}}>
              <StatCard title="Total Employees" value={stats?.employees || 0} icon={<PeopleIcon />} color="secondary" />
            </Grid>
            <Grid size={{xs: 12, sm: 4}}>
              <StatCard title="System Tasks" value={stats?.tasks || 0} icon={<AssignmentIcon />} color="success" />
            </Grid>
          </>
        )}

        {user.role === "manager" && (
          <>
            <Grid size={{xs: 12, sm: 6}}>
              <StatCard title="My Team Size" value={stats?.employees || 0} icon={<PeopleIcon />} color="primary" />
            </Grid>
            <Grid size={{xs: 12, sm: 6}}>
              <StatCard title="Team Tasks" value={stats?.tasks || 0} icon={<AssignmentIcon />} color="info" />
            </Grid>
          </>
        )}

        {user.role === "employee" && (
          <>
            <Grid size={{xs: 12, sm: 6}}>
              <StatCard title="My Tasks" value={stats?.tasks || 0} icon={<AssignmentIcon />} color="primary" />
            </Grid>
            <Grid size={{xs: 12, sm: 6}}>
              <StatCard title="Attendance Days" value={stats?.attendance || 0} icon={<AccessTimeIcon />} color="warning" />
            </Grid>
          </>
        )}
      </Grid>

      {/* Role specific quick actions */}
      <Paper sx={{ mt: 4, p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Quick Actions
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          {user.role === "employee" && (
  <>
    <Button variant="contained" color="success" component={Link} to="/attendance">
      Check In / Out
    </Button>
    <Button variant="outlined" component={Link} to="/tasks">
      View My Tasks
    </Button>
  </>
)}

{user.role === "admin" && (
  <>
    <Button variant="contained" component={Link} to="/admin/managers">
      Add New Manager
    </Button>
    <Button variant="outlined" component={Link} to="/admin/reports">
      View System Activity
    </Button>
  </>
)}

{user.role === "manager" && (
  <>
    <Button variant="contained" component={Link} to="/manager/employees">
      Add Team Member
    </Button>
    <Button variant="outlined" component={Link} to="/manager/tasks/new">
      Assign New Task
    </Button>
  </>
)}
        </Box>
      </Paper>
    </Box>
  );
}

export default Dashboard;