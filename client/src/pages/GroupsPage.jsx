import React, { useState, useEffect } from "react";
import {
  Box, Typography, Button, Paper, TextField, List, ListItem,
  ListItemText, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, Card, CardContent, Divider, Avatar, AvatarGroup
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import * as groupService from "../services/groupService";
import api from "../services/api";
import { fetchGroups } from "../features/chat/chatSlice";
import toast from "react-hot-toast";

function GroupsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { groups } = useSelector((state) => state.chat);

  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  useEffect(() => {
    dispatch(fetchGroups());
    if (user.role === "manager") {
      loadMyEmployees();
    }
  }, [dispatch, user.role]);

  const loadMyEmployees = async () => {
    try {
      const res = await api.get("/manager/employees");
      setEmployees(res.data);
    } catch (err) {
      console.error("Failed to load employees", err);
    }
  };

  const handleToggleEmployee = (id) => {
    setSelectedEmployees((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const handleCreateGroup = async () => {
    try {
      if (!groupName.trim()) {
        toast.error("Group name is required");
        return;
      }
      // Creates group and optionally adds selected members.
      // If none selected, the backend auto-adds all employees of this manager by default.
      await groupService.createGroup(groupName, selectedEmployees);
      toast.success("Group created successfully");
      setOpen(false);
      setGroupName("");
      setSelectedEmployees([]);
      dispatch(fetchGroups());
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to create group");
    }
  };

  if (user.role === "employee") {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5">Employees cannot create groups.</Typography>
        <Typography variant="body1">Groups created by your manager will appear in your Chat tab.</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">Manage Groups</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Create Group
        </Button>
      </Box>

      <Grid container spacing={3}>
        {groups.map((g) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={g.id}>
            <Card sx={{ borderRadius: 3, boxShadow: 2, height: '100%' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>{g.name}</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Created by: {g.creator_name || "You"}
                </Typography>
                <Divider sx={{ my: 1.5 }} />
                <Typography variant="caption" display="block">
                  {g.last_message ? `Last: ${g.last_message.slice(0, 30)}...` : "No messages yet"}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button size="small" variant="outlined" onClick={() => navigate('/chat')}>
                    Open in Chat
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {groups.length === 0 && (
          <Grid size={{ xs: 12 }}>
            <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'transparent', boxShadow: 'none' }}>
              <Typography color="text.secondary">No groups found. Create one to get started.</Typography>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Create Group Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Group</DialogTitle>
        <DialogContent dividers>
          <TextField
            autoFocus
            margin="dense"
            label="Group Name"
            fullWidth
            variant="outlined"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            sx={{ mb: 3 }}
          />
          <Typography variant="subtitle2" gutterBottom>
            Select Employees (or leave blank to auto-add all your employees):
          </Typography>
          <List dense sx={{ maxHeight: 200, overflow: 'auto', border: '1px solid #ddd', borderRadius: 1 }}>
            {employees.map((emp) => (
              <ListItem key={emp.id} sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }} onClick={() => handleToggleEmployee(emp.id)}>
                <Checkbox checked={selectedEmployees.includes(emp.id)} disableRipple />
                <ListItemText primary={emp.name} secondary={emp.email} />
              </ListItem>
            ))}
            {employees.length === 0 && (
              <ListItem>
                <ListItemText primary="No employees found." />
              </ListItem>
            )}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateGroup} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default GroupsPage;
