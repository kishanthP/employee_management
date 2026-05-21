import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";

function MeetingCard({ message, isOwn, showSenderName, onJoin }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: isOwn ? "flex-end" : "flex-start",
        mb: 2,
      }}
    >
      {showSenderName && !isOwn && (
        <Typography variant="caption" sx={{ ml: 1, mb: 0.5, color: "text.secondary" }}>
          {message.sender_name}
        </Typography>
      )}
      <Paper
        elevation={2}
        sx={{
          maxWidth: 300,
          p: 2,
          borderRadius: 2,
          borderTopRightRadius: isOwn ? 4 : 16,
          borderTopLeftRadius: !isOwn ? 4 : 16,
          bgcolor: isOwn ? "primary.light" : "background.paper",
          color: "text.primary",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <VideocamIcon sx={{ mr: 1 }} />
          <Typography variant="subtitle1" fontWeight="bold">
            Video Meeting
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ mb: 2 }}>
          {message.content}
        </Typography>
        <Button
          variant="contained"
          fullWidth
          color={isOwn ? "secondary" : "primary"}
          onClick={() => onJoin(message.meeting_room)}
        >
          Join Meeting
        </Button>
        <Typography
          variant="caption"
          sx={{
            display: "block",
            textAlign: "right",
            mt: 1,
            opacity: 0.8,
            fontSize: "0.7rem",
            color: isOwn ? "white" : "text.secondary",
          }}
        >
          {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Typography>
      </Paper>
    </Box>
  );
}

export default MeetingCard;
