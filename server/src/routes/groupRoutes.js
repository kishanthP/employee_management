const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const groupModel = require("../models/groupModel");
const chatModel = require("../models/chatModel");
const { getEmployeesByManager } = require("../models/userModel");

// All routes require authentication
router.use(verifyToken);

// POST /api/groups — Create group (manager only)
router.post("/", async (req, res) => {
  try {
    const { role, id: managerId } = req.user;
    if (role !== "manager" && role !== "admin") {
      return res.status(403).json({ error: "Only managers can create groups" });
    }
    const { name, memberIds } = req.body;
    if (!name) return res.status(400).json({ error: "Group name is required" });

    const group = await groupModel.createGroup(name, managerId);

    // Auto-add manager's employees if no explicit list provided
    let finalMembers = memberIds && memberIds.length ? memberIds : [];
    if (!finalMembers.length && role === "manager") {
      const employees = await getEmployeesByManager(managerId);
      finalMembers = employees.map((e) => e.id);
    }
    // Always include creator
    const allMembers = [...new Set([managerId, ...finalMembers])];
    await groupModel.addGroupMembers(group.id, allMembers);

    res.status(201).json({ ...group, memberCount: allMembers.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/groups — My groups
router.get("/", async (req, res) => {
  try {
    const groups = await groupModel.getGroupsByUser(req.user.id);
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/groups/:id — Group detail + members
router.get("/:id", async (req, res) => {
  try {
    const isMember = await groupModel.isGroupMember(req.params.id, req.user.id);
    if (!isMember) return res.status(403).json({ error: "Not a member of this group" });
    const [group, members] = await Promise.all([
      groupModel.getGroupById(req.params.id),
      groupModel.getGroupMembers(req.params.id),
    ]);
    res.json({ ...group, members });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/groups/:id/messages — Load group message history
router.get("/:id/messages", async (req, res) => {
  try {
    const isMember = await groupModel.isGroupMember(req.params.id, req.user.id);
    if (!isMember) return res.status(403).json({ error: "Not a member of this group" });
    const { before } = req.query;
    const messages = await groupModel.getGroupMessages(req.params.id, 50, before || null);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/groups/:id/members — Add member (manager/admin only)
router.post("/:id/members", async (req, res) => {
  try {
    const group = await groupModel.getGroupById(req.params.id);
    if (!group) return res.status(404).json({ error: "Group not found" });
    if (group.created_by !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }
    const { userIds } = req.body;
    await groupModel.addGroupMembers(req.params.id, userIds);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/groups/:id/members/:userId — Remove member (manager/admin only)
router.delete("/:id/members/:userId", async (req, res) => {
  try {
    const group = await groupModel.getGroupById(req.params.id);
    if (!group) return res.status(404).json({ error: "Group not found" });
    if (group.created_by !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }
    await groupModel.removeGroupMember(req.params.id, req.params.userId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/groups/:id/read — Mark group messages as read
router.post("/:id/read", async (req, res) => {
  try {
    await chatModel.markGroupRead(req.params.id, req.user.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
