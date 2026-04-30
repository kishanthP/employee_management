const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const chatModel = require("../models/chatModel");

// All routes require authentication
router.use(verifyToken);

// GET /api/chat/users — All users for DM selection (with optional search)
router.get("/users", async (req, res) => {
  try {
    const users = await chatModel.getAllUsersForChat(req.user.id);
    const { search } = req.query;
    const filtered = search
      ? users.filter((u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
        )
      : users;
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/chat/conversations — My conversations
router.get("/conversations", async (req, res) => {
  try {
    const conversations = await chatModel.getConversationsForUser(req.user.id);
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/chat/conversations — Get or create conversation with a user
router.post("/conversations", async (req, res) => {
  try {
    const { otherUserId } = req.body;
    const conversation = await chatModel.getOrCreateConversation(req.user.id, otherUserId);
    res.json(conversation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/chat/conversations/:id/messages — Load message history
router.get("/conversations/:id/messages", async (req, res) => {
  try {
    const { before } = req.query;
    const messages = await chatModel.getConversationMessages(
      req.params.id,
      50,
      before || null
    );
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/chat/conversations/:id/read — Mark as read
router.post("/conversations/:id/read", async (req, res) => {
  try {
    await chatModel.markConversationRead(req.params.id, req.user.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/chat/unread — Unread counts
router.get("/unread", async (req, res) => {
  try {
    const counts = await chatModel.getUnreadCounts(req.user.id);
    res.json(counts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
