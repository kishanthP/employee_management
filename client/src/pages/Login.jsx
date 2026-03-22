import { useState } from "react";
import { Container, TextField, Button, Typography, Box, Alert, IconButton, InputAdornment, Grid } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import { setUser } from "../features/auth/authSlice";
import LoginAnimation from "../assets/Login.json";
import { Player } from "@lottiefiles/react-lottie-player";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const data = await authService.login({ email, password });
      dispatch(setUser(data));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
<Box sx={{
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:"linear-gradient(135deg, #F3F0FF 0%, #EAE6FB 100%)"
  }}>
    <Grid container spacing={1}
    sx={{
      maxWidth: 1000,
      width: "100%",
      alignItems: "center",
    }}>
      <Grid size={{ xs: 12, md: 5 }} sx={{ textAlign: "center" }}>
        <Player
  src={LoginAnimation}
  autoplay
  loop
  style={{ width: 400, height: 400 }}
/>
      </Grid>
      <Grid size={{ xs: 12, md: 5.5  }} width="100%" sx={{display: "flex",justifyContent: "center", flexDirection: "column", alignItems: "center", p: 4, borderRadius: 6, boxShadow: 3, bgcolor: "background.paper"}}>
        <Typography variant="h5" component="h1" gutterBottom>
          Welcome Back
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Enter your credentials to continue
        </Typography>

        <Box component="form" onSubmit={handleLogin} sx={{ mt: 0.5, width: "100%" }}>
          <TextField
            label="Email Address"
            fullWidth
            type="email"
            margin="normal"
            required
            autoComplete="email"
            size="small"
            InputProps={{ sx: { py: 0.2, fontSize: "0.9rem"} }}
            InputLabelProps={{ sx: { fontSize: "0.9rem"}}}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
          />

          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            size="small"
             InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <IconButton
            onClick={() => setShowPassword(!showPassword)}
            edge="end"
            size="small"
          >
            {showPassword
              ? <VisibilityOffIcon fontSize="small" />
              : <VisibilityIcon fontSize="small" />}
          </IconButton>
        </InputAdornment>
      ),
      sx: { py: 0.2, fontSize: "0.9rem" },
    }}
            InputLabelProps={{ sx: { fontSize: "0.9rem"}}}
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
          />

          <Button type="submit" variant="contained" fullWidth size="medium" disabled={isLoading} sx={{ mt: 2, py: 0.8 }}>
            Login
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ width: "fit-content", mt: 2, }}>{error}</Alert>}
      </Grid>
    </Grid>
      
    </Box>
  );
}

export default Login;