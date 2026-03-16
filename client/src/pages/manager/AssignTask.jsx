import { useState, useEffect } from "react";
import { Container, Typography, Paper, Grid, TextField, Button, Box, MenuItem, Alert, Card, CardHeader, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import managerService from "../../services/managerService";

function AssignTask() {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assigned_to: "",
    priority: "medium",
    due_date: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await managerService.getTeamEmployees();
        setEmployees(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await managerService.assignTask(formData);
      setSuccess("Task assigned successfully!");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to assign task");
    }
  };

  return (
    <Container maxWidth="md">
      <Card elevation={3}>
        <CardHeader title="Assign New Task" subheader="Define a task for your team member" sx={{ textAlign: "center", pt: 3 }} />
        <Divider />
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 4 }}>
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Task Title"
                fullWidth
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Assign To"
                fullWidth
                required
                value={formData.assigned_to}
                onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
              >
                {employees.map((emp) => (
                  <MenuItem key={emp.id} value={emp.id}>
                    {emp.name} ({emp.email})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Priority"
                fullWidth
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Due Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button onClick={() => navigate("/dashboard")}>Cancel</Button>
            <Button type="submit" variant="contained" size="large" disabled={!formData.title || !formData.assigned_to}>
              Assign Task
            </Button>
          </Box>
        </Box>
      </Card>
    </Container>
  );
}

export default AssignTask;
