import api from "./api";

export const getUsers = (search = "") =>
  api.get(`/chat/users${search ? `?search=${encodeURIComponent(search)}` : ""}`);

export const getConversations = () => api.get("/chat/conversations");

export const getOrCreateConversation = (otherUserId) =>
  api.post("/chat/conversations", { otherUserId });

export const getMessages = (conversationId, before = null) =>
  api.get(
    `/chat/conversations/${conversationId}/messages${before ? `?before=${before}` : ""}`
  );

export const markConversationRead = (conversationId) =>
  api.post(`/chat/conversations/${conversationId}/read`);

export const getUnreadCounts = () => api.get("/chat/unread");
