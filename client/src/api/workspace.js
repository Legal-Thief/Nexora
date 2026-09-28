

import api from "./api.js";

export const getWorkspaces = () => api.get("/workspaces");

export const getWorkspace = (workspaceId) => api.get(`/workspaces/${workspaceId}`);

export const createWorkspace = (name, description) =>
  api.post("/workspaces", { name, description });

export const updateWorkspace = (workspaceId, data) =>
  api.put(`/workspaces/${workspaceId}`, data);

export const deleteWorkspace = (workspaceId) =>
  api.delete(`/workspaces/${workspaceId}`);

export const inviteMember = (workspaceId, email) =>
  api.post(`/workspaces/${workspaceId}/invite`, { email });

export const removeMember = (workspaceId, userId) =>
  api.delete(`/workspaces/${workspaceId}/members/${userId}`);

export const updateMemberRole = (workspaceId, userId, role) =>
  api.put(`/workspaces/${workspaceId}/members/${userId}/role`, { role });

export const getWorkspaceAnalytics = (workspaceId) =>
  api.get(`/workspaces/${workspaceId}/analytics`);

export const createInvitation = (workspaceId, email, role) =>
  api.post(`/workspaces/${workspaceId}/invitations`, { email, role });

export const getInvitations = (workspaceId) =>
  api.get(`/workspaces/${workspaceId}/invitations`);

export const cancelInvitation = (workspaceId, invId) =>
  api.delete(`/workspaces/${workspaceId}/invitations/${invId}`);

export const getInvitationByToken = (token) =>
  api.get(`/invitations/${token}`);

export const acceptInvitation = (token) =>
  api.post(`/invitations/${token}/accept`);

