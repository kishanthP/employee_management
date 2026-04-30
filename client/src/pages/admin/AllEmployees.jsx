import { useState, useEffect } from "react";
import {
  Container, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, Box, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton,
  Alert, Chip, MenuItem, Select, InputLabel, FormControl,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EditIcon from "@mui/icons-material/Edit";
import adminService from "../../services/adminService";

function AllEmployees() {
  const [employees, setEmployees] = useState([]);
  const [managers, setManagers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", managerId: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchEmployees = async () => {
    try {
      const data = await adminService.getAllEmployees();
      setEmployees(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchManagers = async () => {
    try {
      const data = await adminService.getManagers();
      setManagers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchManagers();
  }, []);

  const handleOpenCreate = () => {
    setFormData({ name: "", email: "", password: "", managerId: "" });
    setError("");
    setSuccess("");
    setOpen(true);
  };

  const handleCreate = async () => {
    setError("");
    setSuccess("");
    try {
      await adminService.createEmployee({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        managerId: formData.managerId,
      });
      setSuccess("Employee created successfully!");
      setOpen(false);
      fetchEmployees();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create employee");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await adminService.deleteEmployee(id);
        setSuccess("Employee deleted successfully!");
        fetchEmployees();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleOpenEdit = (employee) => {
    setSelectedEmployee(employee);
    setFormData({ name: employee.name, email: employee.email, password: "", managerId: employee.manager_id || "" });
    setError("");
    setSuccess("");
    setEditOpen(true);
  };

  const handleUpdate = async () => {
    setError("");
    setSuccess("");
    try {
      const updateData = { name: formData.name, email: formData.email };
      if (formData.password) updateData.password = formData.password;
      await adminService.updateEmployee(selectedEmployee.id, updateData);
      setSuccess("Employee updated successfully!");
      setEditOpen(false);
      setSelectedEmployee(null);
      fetchEmployees();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update employee");
    }
  };

  return (
    <Container>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography variant="h4">All Employees</Typography>
          <Typography color="text.secondary">
            Comprehensive list of all registered employees across all teams.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<PersonAddIcon />} onClick={handleOpenCreate}>
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
              <TableCell sx={{ fontWeight: "bold" }}>Reporting Manager</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Join Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3, color: "text.secondary" }}>
                  No employees found.
                </TableCell>
              </TableRow>
            ) : (
              employees.map((e) => (
                <TableRow key={e.id} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{e.name}</TableCell>
                  <TableCell>{e.email}</TableCell>
                  <TableCell>
                    <Chip label={e.manager_name || "N/A"} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>{new Date(e.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip label="Active" color="success" size="small" />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => handleOpenEdit(e)}>
                      <EditIcon />
                    </IconButton>
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

      {/* Create Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Add New Employee</DialogTitle>
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
          <FormControl fullWidth margin="dense" required>
            <InputLabel>Assign to Manager</InputLabel>
            <Select
              value={formData.managerId}
              label="Assign to Manager"
              onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
            >
              {managers.map((m) => (
                <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreate}
            variant="contained"
            disabled={!formData.name || !formData.email || !formData.password || !formData.managerId}
          >
            Create Employee
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Edit Employee</DialogTitle>
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
            label="New Password (Optional)"
            fullWidth
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            helperText="Leave blank to keep existing password"
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button
            onClick={handleUpdate}
            variant="contained"
            disabled={!formData.name || !formData.email}
          >
            Update Employee
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default AllEmployees;
