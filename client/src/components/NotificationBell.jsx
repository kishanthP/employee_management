import React, { useState } from "react";
import { Badge, IconButton, Popover, List, ListItem, ListItemText, Typography, Box } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUnreadCounts } from "../features/chat/chatSlice";

function NotificationBell() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  
  const { unreadCounts } = useSelector((state) => state.chat);
  
  // Calculate total unread
  const dmUnread = unreadCounts?.conversations?.reduce((acc, c) => acc + Number(c.unread), 0) || 0;
  const groupUnread = unreadCounts?.groups?.reduce((acc, g) => acc + Number(g.unread), 0) || 0;
  const totalUnread = dmUnread + groupUnread;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    dispatch(fetchUnreadCounts()); // Refresh counts
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = () => {
    navigate("/chat");
    handleClose();
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={totalUnread} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Box sx={{ p: 2, minWidth: 250 }}>
          <Typography variant="h6" gutterBottom>Notifications</Typography>
          {totalUnread === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No new messages.
            </Typography>
          ) : (
            <List dense>
              {dmUnread > 0 && (
                <ListItem sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }} onClick={handleNavigate}>
                  <ListItemText primary={`${dmUnread} unread direct message${dmUnread > 1 ? 's' : ''}`} />
                </ListItem>
              )}
              {groupUnread > 0 && (
                <ListItem sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }} onClick={handleNavigate}>
                  <ListItemText primary={`${groupUnread} unread group message${groupUnread > 1 ? 's' : ''}`} />
                </ListItem>
              )}
            </List>
          )}
        </Box>
      </Popover>
    </>
  );
}

export default NotificationBell;
