import { List, ListItem, ListItemIcon, ListItemText, ListItemButton, Drawer, Box, Typography, Badge } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AssessmentIcon from "@mui/icons-material/Assessment";
import HistoryIcon from "@mui/icons-material/History";
import ChatIcon from "@mui/icons-material/Chat";
import GroupIcon from "@mui/icons-material/Group";

const drawerWidth = 240;

function Sidebar() {
  const { user } = useSelector((state) => state.auth);
  const { unreadCounts } = useSelector((state) => state.chat);
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const dmUnread = unreadCounts?.conversations?.reduce((acc, c) => acc + Number(c.unread), 0) || 0;
  const groupUnread = unreadCounts?.groups?.reduce((acc, g) => acc + Number(g.unread), 0) || 0;

  const menuItems = {
    admin: [
      { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
      { text: "Managers", icon: <PeopleIcon />, path: "/admin/managers" },
      { text: "Employees", icon: <PeopleIcon />, path: "/admin/employees" },
      { text: "System Reports", icon: <AssessmentIcon />, path: "/admin/reports" },
      { text: "Chat", icon: <ChatIcon />, path: "/chat", badgeCount: dmUnread },
      { text: "Groups", icon: <GroupIcon />, path: "/groups", badgeCount: groupUnread },
    ],
    manager: [
      { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
      { text: "My Employees", icon: <PeopleIcon />, path: "/manager/employees" },
      { text: "Assign Tasks", icon: <AssignmentIcon />, path: "/manager/tasks/new" },
      { text: "View Tasks", icon: <AssignmentIcon />, path: "/manager/tasks" },
      { text: "Team Attendance", icon: <AccessTimeIcon />, path: "/manager/attendance" },
      { text: "Chat", icon: <ChatIcon />, path: "/chat", badgeCount: dmUnread },
      { text: "Groups", icon: <GroupIcon />, path: "/groups", badgeCount: groupUnread },
    ],
    employee: [
      { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
      { text: "My Tasks", icon: <AssignmentIcon />, path: "/tasks" },
      { text: "My Attendance", icon: <HistoryIcon />, path: "/attendance" },
      { text: "Chat", icon: <ChatIcon />, path: "/chat", badgeCount: dmUnread },
      { text: "Groups", icon: <GroupIcon />, path: "/groups", badgeCount: groupUnread },
    ],
  };

  const roleItems = menuItems[user.role] || [];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          borderRight: "none",
          bgcolor: "#1E2235", // Dark navy sidebar
          color: "white",
          borderRadius: 0,
        },
      }}
    >
      <Box sx={{ mt: 10, overflow: "auto" }}>
        <List sx={{ px: 2 }}>
          {roleItems.map((item) => {
            const isSelected = location.pathname === item.path || location.pathname === item.path + "/";
            return (
              <ListItem key={item.text} disablePadding sx={{ my: 0.5 }}>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  selected={isSelected}
                  sx={{
                    borderRadius: 2,
                    color: "rgba(255, 255, 255, 0.7)",
                    transition: "all 0.2s",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.05)",
                      color: "white",
                      "& .MuiListItemIcon-root": { color: "white" },
                    },
                    "&.Mui-selected": {
                      bgcolor: "primary.main",
                      color: "white",
                      "& .MuiListItemIcon-root": { color: "white" },
                      "&:hover": {
                        bgcolor: "primary.main",
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                    {item.badgeCount ? (
                      <Badge badgeContent={item.badgeCount} color="error">
                        {item.icon}
                      </Badge>
                    ) : (
                      item.icon
                    )}
                  </ListItemIcon>
                  <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: isSelected ? 600 : 500, fontSize: "0.95rem" }} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
}

export default Sidebar;
