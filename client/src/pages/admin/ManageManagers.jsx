import { useState, useEffect } from "react";
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Box, TextField, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Alert } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import adminService from "../../services/adminService";

function ManageManagers() {
  const [managers, setManagers] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchManagers = async () => {
    try {
      const data = await adminService.getManagers();
      setManagers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  const handleCreate = async () => {
    setError("");
    setSuccess("");
    try {
      await adminService.createManager(formData);
      setSuccess("Manager created successfully!");
      setOpen(false);
      setFormData({ name: "", email: "", password: "" });
      fetchManagers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create manager");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this manager?")) {
      try {
        await adminService.deleteManager(id);
        fetchManagers();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <Container>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h4">Manage Managers</Typography>
        <Button variant="contained" startIcon={<PersonAddIcon />} onClick={() => setOpen(true)}>
          Add Manager
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
            {managers.map((m) => (
              <TableRow key={m.id} hover>
                <TableCell>{m.name}</TableCell>
                <TableCell>{m.email}</TableCell>
                <TableCell>{new Date(m.created_at).toLocaleDateString()}</TableCell>
                <TableCell align="right">
                  <IconButton color="error" onClick={() => handleDelete(m.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Add New Manager</DialogTitle>
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
            Create Manager
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default ManageManagers;
