import React from "react";
import { Box, Typography } from "@mui/material";

function MessageBubble({ message, isOwn, showSenderName }) {
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
      <Box
        sx={{
          maxWidth: "70%",
          px: 2,
          py: 1.5,
          borderRadius: 2,
          bgcolor: isOwn ? "primary.main" : "background.paper",
          color: isOwn ? "primary.contrastText" : "text.primary",
          boxShadow: 1,
          borderTopRightRadius: isOwn ? 4 : 16,
          borderTopLeftRadius: !isOwn ? 4 : 16,
        }}
      >
        <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
          {message.content}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            display: "block",
            textAlign: "right",
            mt: 0.5,
            opacity: 0.7,
            fontSize: "0.7rem",
          }}
        >
          {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Typography>
      </Box>
    </Box>
  );
}

export default MessageBubble;
