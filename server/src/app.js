require("dotenv").config();
const pool = require("./config/db");

const http = require("http");
const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const managerRoutes = require("./routes/managerRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const taskRoutes = require("./routes/taskRoutes");
const chatRoutes = require("./routes/chatRoutes");
const groupRoutes = require("./routes/groupRoutes");

const chatModel = require("./models/chatModel");
const groupModel = require("./models/groupModel");

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// ── Public routes ─────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);

// ── Role-protected routes ─────────────────────────────────────────────────────
app.use("/api/admin", adminRoutes);
app.use("/api/manager", managerRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/groups", groupRoutes);

// ── Utility routes ────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.send("Employee Management Server Running");
});

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ message: "Database connected", time: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Socket.io ─────────────────────────────────────────────────────────────────

// Authenticate socket connections via JWT
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("Authentication error: token missing"));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch {
    next(new Error("Authentication error: invalid token"));
  }
});

// Track online users: userId → socketId
const onlineUsers = new Map();

io.on("connection", (socket) => {
  const userId = socket.user.id;
  onlineUsers.set(userId, socket.id);

  // Each user joins their personal room for targeted notifications
  socket.join(`user:${userId}`);

  // Broadcast updated online users list
  io.emit("online_users", Array.from(onlineUsers.keys()));

  // ── Join a chat/group room ──────────────────────────────────────────────────
  socket.on("join_room", ({ roomId }) => {
    socket.join(roomId);
  });

  socket.on("leave_room", ({ roomId }) => {
    socket.leave(roomId);
  });

  // ── Direct message ──────────────────────────────────────────────────────────
  socket.on("send_dm", async ({ conversationId, content, type, meetingRoom }) => {
    try {
      const msg = await chatModel.saveDirectMessage(
        userId,
        conversationId,
        content,
        type || "text",
        meetingRoom || null
      );

      // Get sender name
      const { rows } = await pool.query("SELECT name FROM users WHERE id=$1", [userId]);
      const senderName = rows[0]?.name || "Someone";
      const fullMsg = { ...msg, sender_name: senderName };

      // Broadcast to room
      io.to(`conv:${conversationId}`).emit("new_message", {
        ...fullMsg,
        context: "dm",
        conversationId,
      });

      // Notify the other participant if not in the room
      const { rows: convRows } = await pool.query(
        "SELECT user1_id, user2_id FROM conversations WHERE id=$1",
        [conversationId]
      );
      if (convRows[0]) {
        const otherId =
          convRows[0].user1_id === userId
            ? convRows[0].user2_id
            : convRows[0].user1_id;

        io.to(`user:${otherId}`).emit("notification", {
          type: "new_message",
          conversationId,
          senderName,
          preview: content.slice(0, 60),
        });
      }
    } catch (err) {
      socket.emit("error", { message: err.message });
    }
  });

  // ── Group message ───────────────────────────────────────────────────────────
  socket.on("send_group_msg", async ({ groupId, content, type, meetingRoom }) => {
    try {
      const isMember = await groupModel.isGroupMember(groupId, userId);
      if (!isMember) {
        return socket.emit("error", { message: "Not a member of this group" });
      }

      const msg = await groupModel.saveGroupMessage(
        userId,
        groupId,
        content,
        type || "text",
        meetingRoom || null
      );

      const { rows } = await pool.query("SELECT name FROM users WHERE id=$1", [userId]);
      const senderName = rows[0]?.name || "Someone";
      const fullMsg = { ...msg, sender_name: senderName };

      io.to(`group:${groupId}`).emit("new_message", {
        ...fullMsg,
        context: "group",
        groupId,
      });

      // Notify group members not in the room
      const members = await groupModel.getGroupMembers(groupId);
      members.forEach((m) => {
        if (m.id !== userId) {
          io.to(`user:${m.id}`).emit("notification", {
            type: "new_group_message",
            groupId,
            senderName,
            preview: content.slice(0, 60),
          });
        }
      });
    } catch (err) {
      socket.emit("error", { message: err.message });
    }
  });

  // ── Mark read ───────────────────────────────────────────────────────────────
  socket.on("mark_dm_read", async ({ conversationId }) => {
    try {
      await chatModel.markConversationRead(conversationId, userId);
      socket.emit("read_ack", { conversationId });
    } catch {}
  });

  socket.on("mark_group_read", async ({ groupId }) => {
    try {
      await chatModel.markGroupRead(groupId, userId);
      socket.emit("read_ack", { groupId });
    } catch {}
  });

  // ── Disconnect ──────────────────────────────────────────────────────────────
  socket.on("disconnect", () => {
    onlineUsers.delete(userId);
    io.emit("online_users", Array.from(onlineUsers.keys()));
  });
});

// ── Start server ──────────────────────────────────────────────────────────────
httpServer.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});