import { useState, useEffect } from "react";
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Chip } from "@mui/material";
import adminService from "../../services/adminService";

function AllEmployees() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await adminService.getAllEmployees();
        setEmployees(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEmployees();
  }, []);

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4">All System Employees</Typography>
        <Typography color="text.secondary">Comprehensive list of all registered employees across all teams.</Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: "grey.100" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Department/Team</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Reporting Manager</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((e) => (
              <TableRow key={e.id} hover>
                <TableCell sx={{ fontWeight: 500 }}>{e.name}</TableCell>
                <TableCell>{e.email}</TableCell>
                <TableCell>General</TableCell>
                <TableCell>
                  <Chip label={e.manager_name || "N/A"} size="small" variant="outlined" />
                </TableCell>
                <TableCell>
                  <Chip label="Active" color="success" size="small" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default AllEmployees;
