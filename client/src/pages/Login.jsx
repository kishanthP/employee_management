import { Container, TextField, Button, Typography } from "@mui/material";

function Login() {
  return (
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{ mt: 5 }}>
        Login
      </Typography>

      <TextField
        label="Email"
        fullWidth
        margin="normal"
      />

      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
      />

      <Button variant="contained" fullWidth sx={{ mt: 2 }}>
        Login
      </Button>
    </Container>
  );
}

export default Login;