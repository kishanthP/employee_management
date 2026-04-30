import { Box, Toolbar } from "@mui/material";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { SocketProvider } from "../context/SocketContext";
import { Toaster } from "react-hot-toast";

function Layout({ children }) {
  return (
    <SocketProvider>
      <Toaster position="top-right" />
      <Box sx={{ display: "flex", minHeight: "100vh", background: "linear-gradient(135deg, #F3F0FF 0%, #EAE6FB 100%)" }}>
        <Navbar />
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          {children}
        </Box>
      </Box>
    </SocketProvider>
  );
}

export default Layout;
