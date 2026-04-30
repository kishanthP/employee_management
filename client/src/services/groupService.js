import api from "./api";

export const createGroup = (name, memberIds = []) =>
  api.post("/groups", { name, memberIds });

export const getGroups = () => api.get("/groups");

export const getGroupDetail = (groupId) => api.get(`/groups/${groupId}`);

export const getGroupMessages = (groupId, before = null) =>
  api.get(`/groups/${groupId}/messages${before ? `?before=${before}` : ""}`);

export const addGroupMember = (groupId, userIds) =>
  api.post(`/groups/${groupId}/members`, { userIds });

export const removeGroupMember = (groupId, userId) =>
  api.delete(`/groups/${groupId}/members/${userId}`);

export const markGroupRead = (groupId) => api.post(`/groups/${groupId}/read`);
