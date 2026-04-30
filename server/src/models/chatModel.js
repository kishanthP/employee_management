const pool = require("../config/db");

// ─── Direct Conversations ────────────────────────────────────────────────────

const getOrCreateConversation = async (user1Id, user2Id) => {
  // Normalise order so (A,B) and (B,A) map to the same row
  const [lo, hi] = [user1Id, user2Id].sort((a, b) => a - b);
  const existing = await pool.query(
    "SELECT * FROM conversations WHERE user1_id=$1 AND user2_id=$2",
    [lo, hi]
  );
  if (existing.rows[0]) return existing.rows[0];

  const created = await pool.query(
    "INSERT INTO conversations (user1_id, user2_id) VALUES ($1,$2) RETURNING *",
    [lo, hi]
  );
  return created.rows[0];
};

const getConversationsForUser = async (userId) => {
  const result = await pool.query(
    `SELECT c.id,
            u1.id   AS user1_id, u1.name AS user1_name,
            u2.id   AS user2_id, u2.name AS user2_name,
            (SELECT content FROM messages m
               WHERE m.conversation_id = c.id
               ORDER BY m.created_at DESC LIMIT 1) AS last_message,
            (SELECT created_at FROM messages m
               WHERE m.conversation_id = c.id
               ORDER BY m.created_at DESC LIMIT 1) AS last_message_at
     FROM conversations c
     JOIN users u1 ON c.user1_id = u1.id
     JOIN users u2 ON c.user2_id = u2.id
     WHERE c.user1_id=$1 OR c.user2_id=$1
     ORDER BY last_message_at DESC NULLS LAST`,
    [userId]
  );
  return result.rows;
};

const getConversationMessages = async (conversationId, limit = 50, before = null) => {
  const params = [conversationId, limit];
  let dateFilter = "";
  if (before) {
    params.push(before);
    dateFilter = `AND m.created_at < $${params.length}`;
  }
  const result = await pool.query(
    `SELECT m.*, u.name AS sender_name
     FROM messages m
     JOIN users u ON m.sender_id = u.id
     WHERE m.conversation_id = $1 ${dateFilter}
     ORDER BY m.created_at DESC
     LIMIT $2`,
    params
  );
  return result.rows.reverse();
};

const saveDirectMessage = async (senderId, conversationId, content, type = "text", meetingRoom = null) => {
  const result = await pool.query(
    `INSERT INTO messages (sender_id, conversation_id, content, type, meeting_room)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING *`,
    [senderId, conversationId, content, type, meetingRoom]
  );
  return result.rows[0];
};

// ─── Read Receipts ───────────────────────────────────────────────────────────

const markConversationRead = async (conversationId, userId) => {
  await pool.query(
    `INSERT INTO message_reads (message_id, user_id)
     SELECT m.id, $2 FROM messages m
     WHERE m.conversation_id = $1
       AND m.sender_id != $2
       AND NOT EXISTS (
         SELECT 1 FROM message_reads mr
         WHERE mr.message_id = m.id AND mr.user_id = $2
       )
     ON CONFLICT DO NOTHING`,
    [conversationId, userId]
  );
};

const markGroupRead = async (groupId, userId) => {
  await pool.query(
    `INSERT INTO message_reads (message_id, user_id)
     SELECT m.id, $2 FROM messages m
     WHERE m.group_id = $1
       AND m.sender_id != $2
       AND NOT EXISTS (
         SELECT 1 FROM message_reads mr
         WHERE mr.message_id = m.id AND mr.user_id = $2
       )
     ON CONFLICT DO NOTHING`,
    [groupId, userId]
  );
};

const getUnreadCounts = async (userId) => {
  // Unread per conversation
  const convResult = await pool.query(
    `SELECT m.conversation_id AS id, COUNT(*) AS unread
     FROM messages m
     LEFT JOIN message_reads mr ON mr.message_id = m.id AND mr.user_id = $1
     JOIN conversations c ON c.id = m.conversation_id
     WHERE (c.user1_id = $1 OR c.user2_id = $1)
       AND m.sender_id != $1
       AND mr.message_id IS NULL
     GROUP BY m.conversation_id`,
    [userId]
  );

  // Unread per group
  const groupResult = await pool.query(
    `SELECT m.group_id AS id, COUNT(*) AS unread
     FROM messages m
     LEFT JOIN message_reads mr ON mr.message_id = m.id AND mr.user_id = $1
     JOIN group_members gm ON gm.group_id = m.group_id AND gm.user_id = $1
     WHERE m.sender_id != $1
       AND m.group_id IS NOT NULL
       AND mr.message_id IS NULL
     GROUP BY m.group_id`,
    [userId]
  );

  return {
    conversations: convResult.rows,
    groups: groupResult.rows,
  };
};

// ─── User list for DM ────────────────────────────────────────────────────────

const getAllUsersForChat = async (currentUserId) => {
  const result = await pool.query(
    `SELECT id, name, email, role FROM users WHERE id != $1 ORDER BY name`,
    [currentUserId]
  );
  return result.rows;
};

module.exports = {
  getOrCreateConversation,
  getConversationsForUser,
  getConversationMessages,
  saveDirectMessage,
  markConversationRead,
  markGroupRead,
  getUnreadCounts,
  getAllUsersForChat,
};
