import { getWorkspaces, saveWorkspaces } from '../mock/workspaces';
import { getProjects,   saveProjects   } from '../mock/projects';

const delay = (ms = 450) => new Promise((r) => setTimeout(r, ms));

export const fetchWorkspaces = async () => {
  await delay(400);
  return { workspaces: getWorkspaces() };
};

export const fetchWorkspace = async (id) => {
  await delay(250);
  const ws = getWorkspaces().find((w) => w._id === id);
  if (!ws) throw new Error(`Workspace not found (id: ${id}).`);
  return { workspace: ws };
};

export const createWorkspace = async (data, currentUser) => {
  await delay(500);

  if (!data.name?.trim()) throw new Error('Workspace name is required.');
  if (data.name.trim().length > 80) throw new Error('Workspace name must be 80 characters or fewer.');

  const existing = getWorkspaces().find(
    (w) => w.name.toLowerCase() === data.name.trim().toLowerCase()
  );
  if (existing) throw new Error(`A workspace named "${data.name.trim()}" already exists.`);

  const owner = {
    _id:   currentUser?._id   || 'user_001',
    name:  currentUser?.name  || 'Tanishq Patel',
    email: currentUser?.email || 'demo@nexora.com',
  };

  const workspace = {
    _id:         `ws_${crypto.randomUUID()}`,
    name:        data.name.trim(),
    description: data.description?.trim() || '',
    owner,
    members:     [{ ...owner, role: 'owner', joinedAt: new Date().toISOString() }],
    plan:        ['free','pro'].includes(data.plan) ? data.plan : 'free',
    createdAt:   new Date().toISOString(),
    updatedAt:   new Date().toISOString(),
  };

  const updated = [workspace, ...getWorkspaces()];
  saveWorkspaces(updated);
  return { workspace };
};

export const updateWorkspace = async (id, data) => {
  await delay(350);
  if (!id) throw new Error('Workspace ID is required.');

  const all = getWorkspaces();
  const idx = all.findIndex((w) => w._id === id);
  if (idx === -1) throw new Error('Workspace not found.');

  if (data.name !== undefined) {
    if (!data.name.trim()) throw new Error('Workspace name cannot be empty.');
    if (data.name.trim().length > 80) throw new Error('Name must be 80 characters or fewer.');
  }

  const updated = [...all];
  updated[idx]  = { ...all[idx], ...data, name: data.name?.trim() ?? all[idx].name, updatedAt: new Date().toISOString() };

  saveWorkspaces(updated);
  return { workspace: updated[idx] };
};

export const deleteWorkspace = async (id) => {
  await delay(400);
  if (!id) throw new Error('Workspace ID is required.');

  const all = getWorkspaces();
  if (!all.find((w) => w._id === id)) throw new Error('Workspace not found.');

  saveWorkspaces(all.filter((w) => w._id !== id));
  saveProjects(getProjects().filter((p) => p.workspace !== id));  
  return { success: true };
};

export const fetchProjects = async (workspaceId) => {
  await delay(350);
  if (!workspaceId) throw new Error('Workspace ID is required.');
  return { projects: getProjects().filter((p) => p.workspace === workspaceId) };
};

export const fetchProject = async (id) => {
  await delay(200);
  const project = getProjects().find((p) => p._id === id);
  if (!project) throw new Error(`Project not found (id: ${id}).`);
  return { project };
};

export const createProject = async (workspaceId, data, currentUser) => {
  await delay(500);

  if (!workspaceId)       throw new Error('Workspace ID is required.');
  if (!data.name?.trim()) throw new Error('Project name is required.');
  if (data.name.trim().length > 100) throw new Error('Project name must be 100 characters or fewer.');
  if (data.deadline && isNaN(Date.parse(data.deadline))) {
    throw new Error('Invalid deadline date.');
  }

  const workspaces = getWorkspaces();
  if (!workspaces.find((w) => w._id === workspaceId)) {
    throw new Error('Workspace not found.');
  }

  const createdBy = {
    _id:  currentUser?._id  || 'user_001',
    name: currentUser?.name || 'Tanishq Patel',
  };

  const project = {
    _id:         `proj_${crypto.randomUUID()}`,
    workspace:   workspaceId,
    name:        data.name.trim(),
    description: data.description?.trim() || '',
    emoji:       data.emoji || '📌',
    status:      ['active','paused','completed'].includes(data.status) ? data.status : 'active',
    createdBy,
    members:     [{ ...createdBy, role: 'project_manager' }],
    deadline:    data.deadline || null,
    tasksTotal:  0,
    tasksDone:   0,
    createdAt:   new Date().toISOString(),
    updatedAt:   new Date().toISOString(),
  };

  const updated = [project, ...getProjects()];
  saveProjects(updated);
  return { project };
};

export const updateProject = async (id, data) => {
  await delay(350);
  if (!id) throw new Error('Project ID is required.');

  const all = getProjects();
  const idx = all.findIndex((p) => p._id === id);
  if (idx === -1) throw new Error('Project not found.');

  if (data.name !== undefined) {
    if (!data.name.trim()) throw new Error('Project name cannot be empty.');
    if (data.name.trim().length > 100) throw new Error('Name must be 100 characters or fewer.');
  }
  if (data.deadline && isNaN(Date.parse(data.deadline))) {
    throw new Error('Invalid deadline date.');
  }
  if (data.status && !['active','paused','completed'].includes(data.status)) {
    throw new Error('Invalid project status.');
  }

  const updated = [...all];
  updated[idx]  = {
    ...all[idx],
    ...data,
    name: data.name?.trim() ?? all[idx].name,
    updatedAt: new Date().toISOString(),
  };

  saveProjects(updated);
  return { project: updated[idx] };
};

export const deleteProject = async (id) => {
  await delay(350);
  if (!id) throw new Error('Project ID is required.');

  const all = getProjects();
  if (!all.find((p) => p._id === id)) throw new Error('Project not found.');

  saveProjects(all.filter((p) => p._id !== id));
  return { success: true };
};
