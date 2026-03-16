import { useState, useEffect } from "react";
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Box } from "@mui/material";
import managerService from "../../services/managerService";

function TeamAttendance() {
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const data = await managerService.getTeamAttendance();
        setAttendance(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAttendance();
  }, []);

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4">Team Attendance</Typography>
        <Typography color="text.secondary">Review check-in and check-out logs for your team members.</Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: "grey.100" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Employee</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Check In</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Check Out</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Total Hours</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendance.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3, color: "text.secondary" }}>
                  No attendance records found for your team.
                </TableCell>
              </TableRow>
            ) : (
              attendance.map((rec) => (
                <TableRow key={rec.id} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{rec.employee_name}</TableCell>
                  <TableCell>{new Date(rec.date).toLocaleDateString()}</TableCell>
                  <TableCell>{rec.check_in ? new Date(rec.check_in).toLocaleTimeString() : "-"}</TableCell>
                  <TableCell>{rec.check_out ? new Date(rec.check_out).toLocaleTimeString() : "-"}</TableCell>
                  <TableCell>
                    {rec.total_hours ? <Chip label={`${rec.total_hours}h`} size="small" color="primary" variant="outlined" /> : "-"}
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

export default TeamAttendance;
