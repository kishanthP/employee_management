const pool = require("../config/db");

const createGroup = async (name, createdBy) => {
  const result = await pool.query(
    `INSERT INTO groups (name, created_by) VALUES ($1,$2) RETURNING *`,
    [name, createdBy]
  );
  return result.rows[0];
};

const addGroupMembers = async (groupId, userIds) => {
  if (!userIds.length) return;
  const values = userIds.map((uid, i) => `($1,$${i + 2})`).join(",");
  await pool.query(
    `INSERT INTO group_members (group_id, user_id) VALUES ${values} ON CONFLICT DO NOTHING`,
    [groupId, ...userIds]
  );
};

const removeGroupMember = async (groupId, userId) => {
  await pool.query(
    "DELETE FROM group_members WHERE group_id=$1 AND user_id=$2",
    [groupId, userId]
  );
};

const getGroupsByUser = async (userId) => {
  const result = await pool.query(
    `SELECT g.id, g.name, g.created_by, g.created_at,
            u.name AS creator_name,
            (SELECT content FROM messages m WHERE m.group_id = g.id ORDER BY m.created_at DESC LIMIT 1) AS last_message,
            (SELECT created_at FROM messages m WHERE m.group_id = g.id ORDER BY m.created_at DESC LIMIT 1) AS last_message_at
     FROM groups g
     JOIN group_members gm ON gm.group_id = g.id
     JOIN users u ON u.id = g.created_by
     WHERE gm.user_id = $1
     ORDER BY last_message_at DESC NULLS LAST`,
    [userId]
  );
  return result.rows;
};

const getGroupById = async (groupId) => {
  const result = await pool.query("SELECT * FROM groups WHERE id=$1", [groupId]);
  return result.rows[0];
};

const getGroupMembers = async (groupId) => {
  const result = await pool.query(
    `SELECT u.id, u.name, u.email, u.role
     FROM group_members gm
     JOIN users u ON u.id = gm.user_id
     WHERE gm.group_id = $1`,
    [groupId]
  );
  return result.rows;
};

const getGroupMessages = async (groupId, limit = 50, before = null) => {
  const params = [groupId, limit];
  let dateFilter = "";
  if (before) {
    params.push(before);
    dateFilter = `AND m.created_at < $${params.length}`;
  }
  const result = await pool.query(
    `SELECT m.*, u.name AS sender_name
     FROM messages m
     JOIN users u ON m.sender_id = u.id
     WHERE m.group_id = $1 ${dateFilter}
     ORDER BY m.created_at DESC
     LIMIT $2`,
    params
  );
  return result.rows.reverse();
};

const saveGroupMessage = async (senderId, groupId, content, type = "text", meetingRoom = null) => {
  const result = await pool.query(
    `INSERT INTO messages (sender_id, group_id, content, type, meeting_room)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [senderId, groupId, content, type, meetingRoom]
  );
  return result.rows[0];
};

const isGroupMember = async (groupId, userId) => {
  const result = await pool.query(
    "SELECT 1 FROM group_members WHERE group_id=$1 AND user_id=$2",
    [groupId, userId]
  );
  return result.rowCount > 0;
};

module.exports = {
  createGroup,
  addGroupMembers,
  removeGroupMember,
  getGroupsByUser,
  getGroupById,
  getGroupMembers,
  getGroupMessages,
  saveGroupMessage,
  isGroupMember,
};
