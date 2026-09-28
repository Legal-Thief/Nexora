

import api from "./api.js";

export const getNotifications = () => api.get("/notifications");

export const markRead = (notificationId) =>
  api.put(`/notifications/${notificationId}/read`);

export const markAllRead = () => api.put("/notifications/read-all");

export const deleteNotification = (notificationId) =>
  api.delete(`/notifications/${notificationId}`);

export const getInvitationByToken = (token) =>
  api.get(`/invitations/${token}`);

export const acceptInvitation = (token) =>
  api.post(`/invitations/${token}/accept`);
