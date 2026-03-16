import { useState, useEffect } from "react";
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Box, Alert, Card, CardHeader, Divider } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import attendanceService from "../services/attendanceService";

function MyAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [todayRecord, setTodayRecord] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchData = async () => {
    try {
      const data = await attendanceService.getMyAttendance();
      setAttendance(data);

      const today = new Date().toISOString().split("T")[0];
      const todayRec = data.find(r => r.date.startsWith(today));
      setTodayRecord(todayRec);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCheckIn = async () => {
    try {
      await attendanceService.checkIn();
      setSuccess("Checked in successfully!");
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Check-in failed");
    }
  };

  const handleCheckOut = async () => {
    try {
      await attendanceService.checkOut();
      setSuccess("Checked out successfully!");
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Check-out failed");
    }
  };

  return (
    <Container>
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box>
          <Typography variant="h4">Attendance</Typography>
          <Typography color="text.secondary">Track your daily work hours and check-in history.</Typography>
        </Box>

        <Paper elevation={3} sx={{ p: 2, minWidth: 280, textAlign: "center", borderLeft: "5px solid", borderLeftColor: todayRecord?.check_out ? "success.main" : todayRecord ? "warning.main" : "grey.400" }}>
          {todayRecord?.check_out ? (
            <Typography variant="h6" color="success.main">Today Completed</Typography>
          ) : todayRecord ? (
            <Box>
              <Typography variant="h6" sx={{ mb: 1 }}>On the Clock</Typography>
              <Button variant="contained" color="error" fullWidth onClick={handleCheckOut}>Check Out</Button>
            </Box>
          ) : (
            <Box>
              <Typography variant="h6" sx={{ mb: 1 }}>Not Checked In</Typography>
              <Button variant="contained" color="success" fullWidth onClick={handleCheckIn}>Check In Now</Button>
            </Box>
          )}
        </Paper>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess("")}>{success}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: "grey.100" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Check In</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Check Out</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Total Hours</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendance.map((rec) => (
              <TableRow key={rec.id} hover>
                <TableCell>{new Date(rec.date).toLocaleDateString()}</TableCell>
                <TableCell>{rec.check_in ? new Date(rec.check_in).toLocaleTimeString() : "-"}</TableCell>
                <TableCell>{rec.check_out ? new Date(rec.check_out).toLocaleTimeString() : "-"}</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>{rec.total_hours ? `${rec.total_hours}h` : "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default MyAttendance;