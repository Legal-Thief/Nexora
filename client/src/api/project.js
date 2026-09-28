import api from "./api.js";

export const getProjects = (workspaceId) =>
  api.get(`/workspaces/${workspaceId}/projects`);

export const createProject = (workspaceId, data) =>
  api.post(`/workspaces/${workspaceId}/projects`, data);

export const getProject = (projectId) => api.get(`/projects/${projectId}`);

export const updateProject = (projectId, data) =>
  api.put(`/projects/${projectId}`, data);

export const deleteProject = (projectId) =>
  api.delete(`/projects/${projectId}`);

export const getProjectMembers = (projectId) =>
  api.get(`/projects/${projectId}/members`);

export const addProjectMember = (projectId, userId, role) =>
  api.post(`/projects/${projectId}/members`, { userId, role });

export const removeProjectMember = (projectId, userId) =>
  api.delete(`/projects/${projectId}/members/${userId}`);

export const getProjectActivity = (projectId) =>
  api.get(`/projects/${projectId}/activity`);
