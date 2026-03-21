import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#aa3bff",
      light: "rgba(170, 59, 255, 0.1)",
    },
    background: {
      default: "#f4f3ec",
      paper: "#ffffff",
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
