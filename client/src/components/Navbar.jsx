import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice";

function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <AppBar 
      position="fixed" 
      elevation={0} 
      sx={{ 
        bgcolor: "rgba(255, 255, 255, 0.8)", 
        backdropFilter: "blur(8px)",
        color: "text.primary", 
        borderBottom: "1px solid #F3F4F6", 
        borderColor: "rgba(0, 0, 0, 0.05)",
        borderRadius: 0,
        zIndex: (theme) => theme.zIndex.drawer + 1 
      }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: "bold", color: "primary.main" }}>
          EMS
        </Typography>
        {user && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {user.name} ({user.role})
            </Typography>
            <Button 
              variant="outlined" 
              size="small"
              color="primary" 
              onClick={handleLogout} 
              sx={{ 
                fontWeight: "bold", 
                borderRadius: 2,
                px: 2,
                textTransform: "none"
              }}
            >
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
