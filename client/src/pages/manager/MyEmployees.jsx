import { useState, useEffect } from "react";
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Box, TextField, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Alert } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import managerService from "../../services/managerService";

function MyEmployees() {
  const [employees, setEmployees] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchEmployees = async () => {
    try {
      const data = await managerService.getTeamEmployees();
      setEmployees(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleCreate = async () => {
    setError("");
    setSuccess("");
    try {
      await managerService.createEmployee(formData);
      setSuccess("Employee created successfully and added to your team!");
      setOpen(false);
      setFormData({ name: "", email: "", password: "" });
      fetchEmployees();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create employee");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this employee from your team?")) {
      try {
        await managerService.deleteEmployee(id);
        fetchEmployees();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <Container>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h4">My Team</Typography>
        <Button variant="contained" startIcon={<PersonAddIcon />} onClick={() => setOpen(true)}>
          Add Employee
        </Button>
      </Box>

      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead sx={{ bgcolor: "grey.100" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Join Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 3, color: "text.secondary" }}>
                  No employees in your team yet. Add your first team member!
                </TableCell>
              </TableRow>
            ) : (
              employees.map((e) => (
                <TableRow key={e.id} hover>
                  <TableCell>{e.name}</TableCell>
                  <TableCell>{e.email}</TableCell>
                  <TableCell>{new Date(e.created_at).toLocaleDateString()}</TableCell>
                  <TableCell align="right">
                    <IconButton color="error" onClick={() => handleDelete(e.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Add Team Member</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2, mt: 1 }}>{error}</Alert>}
          <TextField
            margin="dense"
            label="Full Name"
            fullWidth
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email Address"
            fullWidth
            required
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Initial Password"
            fullWidth
            required
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleCreate} variant="contained" disabled={!formData.name || !formData.email || !formData.password}>
            Add Employee
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default MyEmployees;
