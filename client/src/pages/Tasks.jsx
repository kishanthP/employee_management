import { useState, useEffect } from "react";
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Box, Chip, MenuItem, Select, Alert } from "@mui/material";
import taskService from "../services/taskService";

function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [success, setSuccess] = useState("");

  const fetchTasks = async () => {
    try {
      const data = await taskService.getMyTasks();
      setTasks(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.updateTaskStatus(taskId, newStatus);
      setSuccess("Task status updated!");
      fetchTasks();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const getPriorityColor = (p) => {
    switch (p) {
      case "high": return "error";
      case "medium": return "warning";
      case "low": return "info";
      default: return "default";
    }
  };

  const getStatusColor = (s) => {
    switch (s) {
      case "completed": return "success";
      case "in_progress": return "primary";
      case "pending": return "default";
      default: return "default";
    }
  };

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4">My Tasks</Typography>
        <Typography color="text.secondary">Tasks assigned to you by your manager.</Typography>
      </Box>

      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: "grey.100" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Task</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Priority</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Due Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Assigned By</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="right">Update Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3, color: "text.secondary" }}>
                  Great job! You have no pending tasks.
                </TableCell>
              </TableRow>
            ) : (
              tasks.map((task) => (
                <TableRow key={task.id} hover>
                  <TableCell>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>{task.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{task.description}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={task.priority} size="small" color={getPriorityColor(task.priority)} />
                  </TableCell>
                  <TableCell>{task.due_date ? new Date(task.due_date).toLocaleDateString() : "No date"}</TableCell>
                  <TableCell>{task.assigned_by}</TableCell>
                  <TableCell>
                    <Chip label={task.status.replace("_", " ")} size="small" color={getStatusColor(task.status)} />
                  </TableCell>
                  <TableCell align="right">
                    <Select
                      size="small"
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      sx={{ minWidth: 120 }}
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="in_progress">In Progress</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default MyTasks;