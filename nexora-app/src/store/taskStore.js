import { create } from 'zustand';
import * as taskService from '../services/taskService';

export const useTaskStore = create((set, get) => ({
  tasks:        [],
  activeTask:   null,
  loading:      false,
  draggedTaskId: null,
  filters:      { search: '', priority: '', assignee: '' },

  setFilters:    (filters) => set((s) => ({ filters: { ...s.filters, ...filters } })),
  clearFilters:  () => set({ filters: { search: '', priority: '', assignee: '' } }),
  setDraggedTask:(id)   => set({ draggedTaskId: id }),
  setActiveTask: (task) => set({ activeTask: task }),
  clearActiveTask: ()   => set({ activeTask: null }),

  //  Read 
  fetchTasks: async (projectId) => {
    set({ loading: true });
    try {
      const { tasks } = await taskService.fetchTasks(projectId, get().filters);
      set({ tasks, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  /** Get tasks for a Kanban column (client-side filtered). */
  getTasksByColumn: (column) => {
    const { tasks, filters } = get();
    return tasks
      .filter((t) => t.status === column)
      .filter((t) => !filters.search   || t.title.toLowerCase().includes(filters.search.toLowerCase()))
      .filter((t) => !filters.priority || t.priority === filters.priority)
      .filter((t) => !filters.assignee || t.assignee?._id === filters.assignee);
  },

  // ── Create ─────────────────────────────────────────────────────────────────

  createTask: async (projectId, data) => {
    const { task } = await taskService.createTask(projectId, data);
    set((s) => ({ tasks: [...s.tasks, task] }));
    return task;
  },

  // ── Update: status (drag & drop — optimistic with rollback) ───────────────

  updateTaskStatus: async (id, status) => {
    // Snapshot for rollback
    const snapshot = get().tasks.find((t) => t._id === id);
    // Optimistic update
    set((s) => ({ tasks: s.tasks.map((t) => (t._id === id ? { ...t, status } : t)) }));
    try {
      const { task } = await taskService.updateTaskStatus(id, status);
      // Replace with authoritative version (has updated __v + updatedAt)
      set((s) => ({
        tasks:      s.tasks.map((t) => (t._id === id ? task : t)),
        activeTask: s.activeTask?._id === id ? task : s.activeTask,
      }));
    } catch (err) {
      // Rollback on failure
      if (snapshot) set((s) => ({ tasks: s.tasks.map((t) => (t._id === id ? snapshot : t)) }));
      throw err;
    }
  },

  // ── Update: full edit (title, description, priority, assignee, deadline) ──

  updateTask: async (id, data) => {
    const { task } = await taskService.updateTask(id, data);
    set((s) => ({
      tasks:      s.tasks.map((t) => (t._id === id ? task : t)),
      activeTask: s.activeTask?._id === id ? task : s.activeTask,
    }));
    return task;
  },

  // ── Delete ─────────────────────────────────────────────────────────────────

  deleteTask: async (id) => {
    await taskService.deleteTask(id);
    set((s) => ({
      tasks:      s.tasks.filter((t) => t._id !== id),
      activeTask: s.activeTask?._id === id ? null : s.activeTask,
    }));
  },

  // ── Real-time socket handlers (no-op until backend is ready) ──────────────
  socketUpdateTask: (task) =>
    set((s) => ({
      tasks:      s.tasks.map((t) => (t._id === task._id ? task : t)),
      activeTask: s.activeTask?._id === task._id ? task : s.activeTask,
    })),
  socketAddTask:    (task)   => set((s) => ({ tasks: [...s.tasks, task] })),
  socketDeleteTask: (taskId) => set((s) => ({ tasks: s.tasks.filter((t) => t._id !== taskId) })),

  clearTasks: () => set({ tasks: [], activeTask: null }),
}));

export default useTaskStore;
