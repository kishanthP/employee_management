import { useState, useEffect } from "react";
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Tabs, Tab, List, ListItem, ListItemText, Divider, Chip } from "@mui/material";
import AssessmentIcon from "@mui/icons-material/Assessment";
import HistoryIcon from "@mui/icons-material/History";
import adminService from "../../services/adminService";

function SystemReports() {
  const [tab, setTab] = useState(0);
  const [attendance, setAttendance] = useState([]);
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [attData, actData] = await Promise.all([
          adminService.getAttendanceReports(),
          adminService.getActivityLogs(),
        ]);
        setAttendance(attData);
        setActivity(actData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4">System Reports & Activity</Typography>
        <Typography color="text.secondary">Global overview of all organizational actions and attendance.</Typography>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tab} onChange={(e, v) => setTab(v)} variant="fullWidth" indicatorColor="primary" textColor="primary">
          <Tab icon={<AssessmentIcon />} label="Attendance Overview" />
          <Tab icon={<HistoryIcon />} label="System Activity Log" />
        </Tabs>
      </Paper>

      {tab === 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ bgcolor: "grey.100" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Employee</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>In</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Out</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Hours</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendance.map((rec) => (
                <TableRow key={rec.id} hover>
                  <TableCell>{rec.name} ({rec.role})</TableCell>
                  <TableCell>{new Date(rec.date).toLocaleDateString()}</TableCell>
                  <TableCell>{rec.check_in ? new Date(rec.check_in).toLocaleTimeString() : "-"}</TableCell>
                  <TableCell>{rec.check_out ? new Date(rec.check_out).toLocaleTimeString() : "-"}</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>{rec.total_hours || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper elevation={2}>
          <List>
            {activity.map((log, index) => (
              <Box key={log.id}>
                <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                  <ListItemText
                    primary={log.action}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary" sx={{ display: "inline", mr: 1 }}>
                          {log.user_name} ({log.role})
                        </Typography>
                        — {new Date(log.created_at).toLocaleString()}
                      </>
                    }
                  />
                  <Chip label={log.role} size="small" variant="outlined" />
                </ListItem>
                {index < activity.length - 1 && <Divider component="li" />}
              </Box>
            ))}
          </List>
        </Paper>
      )}
    </Container>
  );
}

export default SystemReports;
