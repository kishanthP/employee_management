import { List, ListItem, ListItemIcon, ListItemText, Drawer, Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AssessmentIcon from "@mui/icons-material/Assessment";
import HistoryIcon from "@mui/icons-material/History";

const drawerWidth = 240;

function Sidebar() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const menuItems = {
    admin: [
      { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
      { text: "Manage Managers", icon: <PeopleIcon />, path: "/admin/managers" },
      { text: "All Employees", icon: <PeopleIcon />, path: "/admin/employees" },
      { text: "System Reports", icon: <AssessmentIcon />, path: "/admin/reports" },
    ],
    manager: [
      { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
      { text: "My Employees", icon: <PeopleIcon />, path: "/manager/employees" },
      { text: "Assign Tasks", icon: <AssignmentIcon />, path: "/manager/tasks/new" },
      { text: "View Tasks", icon: <AssignmentIcon />, path: "/manager/tasks" },
      { text: "Team Attendance", icon: <AccessTimeIcon />, path: "/manager/attendance" },
    ],
    employee: [
      { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
      { text: "My Tasks", icon: <AssignmentIcon />, path: "/tasks" },
      { text: "My Attendance", icon: <HistoryIcon />, path: "/attendance" },
    ],
  };

  const roleItems = menuItems[user.role] || [];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box", borderRight: "1px solid", borderColor: "divider" },
      }}
    >
      <Box sx={{ mt: 8, overflow: "auto" }}>
        <List>
          {roleItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                my: 0.5,
                mx: 0,
                borderRadius: 2,
                "&.Mui-selected": {
                  bgcolor: "primary.light",
                  color: "primary.main",
                  "& .MuiListItemIcon-root": { color: "primary.main" },
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 500 }} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}

export default Sidebar;
