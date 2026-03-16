import { useState } from "react";
import { Container, TextField, Button, Typography, Box, Alert } from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import { setUser } from "../features/auth/authSlice";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await authService.login({ email, password });
      dispatch(setUser(data));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: "flex", flexDirection: "column", alignItems: "center", p: 4, borderRadius: 2, boxShadow: 3, bgcolor: "background.paper" }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Employee Management
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Please login to continue
        </Typography>

        {error && <Alert severity="error" sx={{ width: "100%", mt: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleLogin} sx={{ mt: 2, width: "100%" }}>
          <TextField
            label="Email Address"
            fullWidth
            margin="normal"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit" variant="contained" fullWidth size="large" sx={{ mt: 3, mb: 2, py: 1.5 }}>
            Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;