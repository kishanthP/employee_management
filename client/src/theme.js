import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#5B6CF9", // Indigo blue primary
      light: "rgba(91, 108, 249, 0.1)",
    },
    success: {
      main: "#22C55E", // Green for attendance
    },
    warning: {
      main: "#F59E0B", // Amber for tasks
    },
    error: {
      main: "#EF4444", // Red for danger
    },
    background: {
      default: "#F9FAFB", // Slightly cleaner off-white
      paper: "#ffffff",
    },
    text: {
      primary: "#111827",
      secondary: "#4B5563",
    },
  },
  typography: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    h1: { fontFamily: "'Outfit', sans-serif", fontWeight: 600 },
    h2: { fontFamily: "'Outfit', sans-serif", fontWeight: 600 },
    h3: { fontFamily: "'Outfit', sans-serif", fontWeight: 600 },
    h4: { fontFamily: "'Outfit', sans-serif", fontWeight: 600 },
    h5: { fontFamily: "'Outfit', sans-serif", fontWeight: 600 },
    h6: { fontFamily: "'Outfit', sans-serif", fontWeight: 600 },
    button: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 400 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, textTransform: "none" },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: 12 },
      },
    },
  },
});

export default theme;
