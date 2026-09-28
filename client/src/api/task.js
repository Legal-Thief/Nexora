

import api from "./api.js";

export const getTasks = (projectId) =>
  api.get(`/projects/${projectId}/tasks`);

export const createTask = (projectId, data) =>
  api.post(`/projects/${projectId}/tasks`, data);

export const getTask = (taskId) => api.get(`/tasks/${taskId}`);

export const updateTask = (taskId, data) =>
  api.put(`/tasks/${taskId}`, data);

export const deleteTask = (taskId) => api.delete(`/tasks/${taskId}`);

export const getComments = (taskId) =>
  api.get(`/tasks/${taskId}/comments`);

export const addComment = (taskId, content) =>
  api.post(`/tasks/${taskId}/comments`, { content });

export const updateComment = (commentId, content) =>
  api.put(`/comments/${commentId}`, { content });

export const deleteComment = (commentId) =>
  api.delete(`/comments/${commentId}`);
