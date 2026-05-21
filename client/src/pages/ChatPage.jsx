import React, { useState, useEffect, useRef } from "react";
import {
  Box, Paper, Typography, List, ListItem, ListItemText, ListItemAvatar,
  Avatar, Badge, Divider, IconButton, TextField, InputAdornment, Button, Tabs, Tab
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SendIcon from "@mui/icons-material/Send";
import VideocamIcon from "@mui/icons-material/Videocam";
import { useDispatch, useSelector } from "react-redux";
import { useSocket } from "../context/SocketContext";
import {
  fetchConversations, fetchGroups, setActiveChat, fetchUnreadCounts,
  setMessages, addMessage, markReadLocal, updateLatestMessage
} from "../features/chat/chatSlice";
import * as chatService from "../services/chatService";
import * as groupService from "../services/groupService";
import MessageBubble from "../components/chat/MessageBubble";
import MeetingCard from "../components/chat/MeetingCard";

function ChatPage() {
  const dispatch = useDispatch();
  const socket = useSocket();
  const { user } = useSelector((state) => state.auth);
  const { conversations, groups, activeChat, messages, unreadCounts, onlineUsers } = useSelector((state) => state.chat);

  const [tabIndex, setTabIndex] = useState(0); // 0: DM, 1: Groups
  const [usersList, setUsersList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");

  const messagesEndRef = useRef(null);

  // Initial load
  useEffect(() => {
    dispatch(fetchConversations());
    dispatch(fetchGroups());
    dispatch(fetchUnreadCounts());
    loadAllUsers();
  }, [dispatch]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadAllUsers = async (search = "") => {
    try {
      const res = await chatService.getUsers(search);
      setUsersList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    loadAllUsers(query);
  };

  const handleSelectUser = async (otherUser) => {
    try {
      const res = await chatService.getOrCreateConversation(otherUser.id);
      const conversationId = res.data.id;

      dispatch(setActiveChat({ id: conversationId, type: "dm", placeholderName: otherUser.name }));

      // Load history
      const history = await chatService.getMessages(conversationId);
      dispatch(setMessages(history.data));

      // Join socket room
      socket?.emit("join_room", { roomId: `conv:${conversationId}` });

      // Mark read
      await chatService.markConversationRead(conversationId);
      socket?.emit("mark_dm_read", { conversationId });
      dispatch(markReadLocal({ id: conversationId, type: "conversations" }));
      dispatch(fetchUnreadCounts());
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectGroup = async (group) => {
    try {
      dispatch(setActiveChat({ id: group.id, type: "group", placeholderName: group.name }));

      // Load history
      const history = await groupService.getGroupMessages(group.id);
      dispatch(setMessages(history.data));

      // Join socket room
      socket?.emit("join_room", { roomId: `group:${group.id}` });

      // Mark read
      await groupService.markGroupRead(group.id);
      socket?.emit("mark_group_read", { groupId: group.id });
      dispatch(markReadLocal({ id: group.id, type: "groups" }));
      dispatch(fetchUnreadCounts());
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    if (activeChat.type === "dm") {
      socket?.emit("send_dm", {
        conversationId: activeChat.id,
        content: newMessage,
      });
    } else {
      socket?.emit("send_group_msg", {
        groupId: activeChat.id,
        content: newMessage,
      });
    }
    setNewMessage("");
  };

  const handleStartMeeting = () => {
    if (!activeChat) return;
    const room = `meet_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const content = `Join my video meeting: ${activeChat.placeholderName}`;

    if (activeChat.type === "dm") {
      socket?.emit("send_dm", {
        conversationId: activeChat.id,
        content,
        type: "meeting",
        meetingRoom: room,
      });
    } else {
      socket?.emit("send_group_msg", {
        groupId: activeChat.id,
        content,
        type: "meeting",
        meetingRoom: room,
      });
    }
  };

  // Helper to get conversation list item data
  const getDMList = () => {
    const list = usersList.map((u) => {
      const conversation = conversations.find(
        (c) => (c.user1_id === user?.id && c.user2_id === u.id) || (c.user2_id === user?.id && c.user1_id === u.id)
      );

      let unread = 0;
      let subtitle = u.role || "User";
      let itemId = u.id;
      let lastMessageAt = 0;

      if (conversation) {
        unread = unreadCounts.conversations?.find((x) => x.id === conversation.id)?.unread || 0;
        itemId = conversation.id;
        if (conversation.last_message) {
          subtitle = conversation.last_message;
        }
        if (conversation.last_message_at) {
          lastMessageAt = new Date(conversation.last_message_at).getTime();
        }
      }

      return {
        id: itemId,
        name: u.name,
        subtitle: subtitle,
        onClick: () => handleSelectUser(u),
        unread: parseInt(unread),
        isOnline: onlineUsers.includes(u.id),
        lastMessageAt,
        hasConversation: !!conversation
      };
    });

    return list.sort((a, b) => {
      if (a.hasConversation && !b.hasConversation) return -1;
      if (!a.hasConversation && b.hasConversation) return 1;
      if (a.hasConversation && b.hasConversation) {
        return b.lastMessageAt - a.lastMessageAt;
      }
      return a.name.localeCompare(b.name);
    });
  };

  const getGroupList = () => {
    return groups.map((g) => {
      const unread = unreadCounts.groups?.find((x) => x.id === g.id)?.unread || 0;
      return {
        id: g.id,
        name: g.name,
        subtitle: g.last_message || "No messages yet",
        onClick: () => handleSelectGroup(g),
        unread: parseInt(unread),
        isOnline: false
      };
    });
  };

  return (
    <Box sx={{ display: "flex", height: "calc(100vh - 125px)", gap: 2 }}>
      {/* Left Panel: List */}
      <Paper sx={{ width: 350, display: "flex", flexDirection: "column", borderRadius: 3, overflow: "hidden" }}>
        <Tabs value={tabIndex} onChange={(e, v) => setTabIndex(v)} variant="fullWidth">
          <Tab label="Direct Messages" />
          <Tab label="Groups" />
        </Tabs>

        {tabIndex === 0 && (
          <Box sx={{ p: 2 }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Search users..."
              value={searchQuery}
              onChange={handleSearch}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
              }}
            />
          </Box>
        )}

        <List sx={{ flexGrow: 1, overflow: "auto" }}>
          {(tabIndex === 0 ? getDMList() : getGroupList()).map((item, idx) => (
            <React.Fragment key={idx}>
              <ListItem sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }} onClick={item.onClick} selected={activeChat?.id === item.id}>
                <ListItemAvatar>
                  <Badge
                    color="success"
                    variant="dot"
                    invisible={!item.isOnline}
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  >
                    <Avatar sx={{ bgcolor: tabIndex === 1 ? "secondary.main" : "primary.main" }}>
                      {item.name.charAt(0).toUpperCase()}
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={item.name}
                  secondary={item.subtitle}
                  primaryTypographyProps={{ fontWeight: Number(item.unread) > 0 ? "bold" : "normal" }}
                  secondaryTypographyProps={{
                    noWrap: true,
                    color: Number(item.unread) > 0 ? "text.primary" : "text.secondary",
                  }}
                />
                {Number(item.unread) > 0 && (
                  <Badge badgeContent={item.unread} color="error" sx={{ mr: 2 }} />
                )}
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
      </Paper>

      {/* Right Panel: Chat Area */}
      <Paper sx={{ flexGrow: 1, display: "flex", flexDirection: "column", borderRadius: 3, overflow: "hidden" }}>
        {activeChat ? (
          <>
            {/* Header */}
            <Box sx={{ p: 2, bgcolor: "background.default", borderBottom: 1, borderColor: "divider", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar sx={{ mr: 2, bgcolor: activeChat.type === "group" ? "secondary.main" : "primary.main" }}>
                  {activeChat.placeholderName.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="h6">{activeChat.placeholderName}</Typography>
              </Box>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<VideocamIcon />}
                onClick={handleStartMeeting}
              >
                Start Meeting
              </Button>
            </Box>

            {/* Messages */}
            <Box sx={{ flexGrow: 1, p: 2, overflowY: "auto", bgcolor: "#F8F9FA" }}>
              {messages.map((msg, i) => {
                const isOwn = msg.sender_id === user.id;
                const showSenderName = activeChat.type === "group" && !isOwn;

                if (msg.type === "meeting") {
                  return (
                    <MeetingCard
                      key={msg.id || i}
                      message={msg}
                      isOwn={isOwn}
                      showSenderName={showSenderName}
                      onJoin={(room) => window.open(`https://meet.ffmuc.net/${room}`, "_blank")}
                    />
                  );
                }

                return (
                  <MessageBubble
                    key={msg.id || i}
                    message={msg}
                    isOwn={isOwn}
                    showSenderName={showSenderName}
                  />
                );
              })}
              <div ref={messagesEndRef} />
            </Box>

            {/* Input */}
            <Box component="form" onSubmit={handleSendMessage} sx={{ p: 2, bgcolor: "background.paper", borderTop: 1, borderColor: "divider", display: "flex" }}>
              <TextField
                fullWidth
                placeholder="Type a message..."
                variant="outlined"
                size="small"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                sx={{ mr: 1 }}
              />
              <IconButton color="primary" type="submit" disabled={!newMessage.trim()}>
                <SendIcon />
              </IconButton>
            </Box>
          </>
        ) : (
          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography variant="h6" color="text.secondary">
              Select a conversation or group to start chatting
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default ChatPage;
