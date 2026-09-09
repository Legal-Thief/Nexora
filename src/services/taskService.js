import { getTasks, saveTasks } from '../mock/tasks';

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

const VALID_STATUSES   = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'];
const VALID_PRIORITIES = ['urgent', 'high', 'medium', 'low'];

export const fetchTasks = async (projectId, filters = {}) => {
  await delay(350);
  if (!projectId) throw new Error('Project ID is required.');

  let tasks = getTasks().filter((t) => t.project === projectId);

  if (filters.search) {
    const q = filters.search.toLowerCase();
    tasks = tasks.filter(
      (t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
    );
  }
  if (filters.priority) {
    if (!VALID_PRIORITIES.includes(filters.priority)) throw new Error('Invalid priority filter.');
    tasks = tasks.filter((t) => t.priority === filters.priority);
  }
  if (filters.assignee) tasks = tasks.filter((t) => t.assignee?._id === filters.assignee);
  if (filters.status)   tasks = tasks.filter((t) => t.status === filters.status);

  return { tasks };
};

export const fetchTask = async (id) => {
  await delay(150);
  if (!id) throw new Error('Task ID is required.');
  const task = getTasks().find((t) => t._id === id);
  if (!task) throw new Error(`Task not found (id: ${id}).`);
  return { task };
};

export const createTask = async (projectId, data) => {
  await delay(450);

  if (!projectId)         throw new Error('Project ID is required.');
  if (!data.title?.trim()) throw new Error('Task title is required.');
  if (data.title.trim().length > 200) throw new Error('Title must be 200 characters or fewer.');
  if (data.priority && !VALID_PRIORITIES.includes(data.priority)) {
    throw new Error(`Invalid priority: "${data.priority}". Must be urgent, high, medium, or low.`);
  }
  if (data.deadline && isNaN(Date.parse(data.deadline))) {
    throw new Error('Invalid deadline date.');
  }

  const all  = getTasks();
  const task = {
    _id:         `task_${crypto.randomUUID()}`,
    title:       data.title.trim(),
    description: data.description?.trim() || '',
    project:     projectId,
    workspace:   'ws_001',
    assignee:    data.assignee || null,
    status:      'TODO',
    priority:    VALID_PRIORITIES.includes(data.priority) ? data.priority : 'medium',
    deadline:    data.deadline || null,
    labels:      Array.isArray(data.labels) ? data.labels.filter(Boolean) : [],
    position:    all.filter((t) => t.status === 'TODO').length,
    __v:         0,
    createdAt:   new Date().toISOString(),
    updatedAt:   new Date().toISOString(),
  };

  saveTasks([...all, task]);
  return { task };
};

export const updateTaskStatus = async (id, status) => {
  await delay(150);
  if (!id) throw new Error('Task ID is required.');
  if (!VALID_STATUSES.includes(status)) {
    throw new Error(`Invalid status: "${status}". Must be one of ${VALID_STATUSES.join(', ')}.`);
  }

  const all = getTasks();
  const idx = all.findIndex((t) => t._id === id);
  if (idx === -1) throw new Error(`Task not found (id: ${id}).`);

  const updated = [...all];
  updated[idx]  = { ...all[idx], status, updatedAt: new Date().toISOString(), __v: all[idx].__v + 1 };

  saveTasks(updated);
  return { task: updated[idx] };
};

export const updateTask = async (id, data) => {
  await delay(300);
  if (!id) throw new Error('Task ID is required.');

  const all = getTasks();
  const idx = all.findIndex((t) => t._id === id);
  if (idx === -1) throw new Error(`Task not found (id: ${id}).`);

  if (data.title !== undefined) {
    if (!data.title.trim())          throw new Error('Task title cannot be empty.');
    if (data.title.trim().length > 200) throw new Error('Title must be 200 characters or fewer.');
  }
  if (data.priority && !VALID_PRIORITIES.includes(data.priority)) {
    throw new Error(`Invalid priority: "${data.priority}".`);
  }
  if (data.status && !VALID_STATUSES.includes(data.status)) {
    throw new Error(`Invalid status: "${data.status}".`);
  }
  if (data.deadline && isNaN(Date.parse(data.deadline))) {
    throw new Error('Invalid deadline date.');
  }

  const updated = [...all];
  updated[idx]  = {
    ...all[idx],
    ...data,
    title:     data.title?.trim()       ?? all[idx].title,
    updatedAt: new Date().toISOString(),
    __v:       all[idx].__v + 1,
  };

  saveTasks(updated);
  return { task: updated[idx] };
};

export const deleteTask = async (id) => {
  await delay(250);
  if (!id) throw new Error('Task ID is required.');

  const all = getTasks();
  if (!all.find((t) => t._id === id)) throw new Error(`Task not found (id: ${id}).`);

  saveTasks(all.filter((t) => t._id !== id));
  return { success: true };
};
