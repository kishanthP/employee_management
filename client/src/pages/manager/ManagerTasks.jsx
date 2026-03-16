import { useState, useEffect } from "react";
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Chip } from "@mui/material";
import managerService from "../../services/managerService";

function ManagerTasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await managerService.getTeamTasks();
        setTasks(data);
      } catch (err) {
        console.error("Failed to fetch tasks", err);
      }
    };
    fetchTasks();
  }, []);

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
        <Typography variant="h4">Track Team Tasks</Typography>
        <Typography color="text.secondary">View the progress of tasks you have assigned to your team.</Typography>
      </Box>

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead sx={{ bgcolor: "grey.100" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Task Title</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Assigned To</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Priority</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Due Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3, color: "text.secondary" }}>
                  No tasks found. Start by assigning some tasks to your team!
                </TableCell>
              </TableRow>
            ) : (
              tasks.map((task) => (
                <TableRow key={task.id} hover>
                  <TableCell>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>{task.title}</Typography>
                    <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 300 }}>
                      {task.description}
                    </Typography>
                  </TableCell>
                  <TableCell>{task.employee_name}</TableCell>
                  <TableCell>
                    <Chip label={task.priority} size="small" color={getPriorityColor(task.priority)} />
                  </TableCell>
                  <TableCell>
                    {task.due_date ? new Date(task.due_date).toLocaleDateString() : "N/A"}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={task.status.replace("_", " ")} 
                      size="small" 
                      color={getStatusColor(task.status)} 
                      sx={{ fontWeight: "bold" }}
                    />
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

export default ManagerTasks;
