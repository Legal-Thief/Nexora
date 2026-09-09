import { create } from 'zustand';
import * as svc from '../services/workspaceService';

export const useWorkspaceStore = create((set, get) => ({
  workspaces:      [],
  activeWorkspace: null,
  projects:        [],
  activeProject:   null,
  loading:         false,
  error:           null,

  fetchWorkspaces: async () => {
    set({ loading: true, error: null });
    try {
      const { workspaces } = await svc.fetchWorkspaces();
      set({ workspaces, loading: false });
      if (!get().activeWorkspace && workspaces.length > 0) {
        get().setActiveWorkspace(workspaces[0]);
      }
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  setActiveWorkspace: (workspace) => {
    set({ activeWorkspace: workspace, projects: [], activeProject: null });
    get().fetchProjects(workspace._id);
  },

  createWorkspace: async (data, currentUser) => {
    set({ loading: true, error: null });
    try {
      const { workspace } = await svc.createWorkspace(data, currentUser);
      set((s) => ({
        workspaces:      [workspace, ...s.workspaces],
        activeWorkspace: workspace,
        projects:        [],
        loading:         false,
      }));
      return workspace;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  updateWorkspace: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const { workspace } = await svc.updateWorkspace(id, data);
      set((s) => ({
        workspaces:      s.workspaces.map((w) => (w._id === id ? workspace : w)),
        activeWorkspace: s.activeWorkspace?._id === id ? workspace : s.activeWorkspace,
        loading:         false,
      }));
      return workspace;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  deleteWorkspace: async (id) => {
    set({ loading: true, error: null });
    try {
      await svc.deleteWorkspace(id);
      const remaining = get().workspaces.filter((w) => w._id !== id);
      const nextActive = remaining[0] || null;
      set({
        workspaces:      remaining,
        activeWorkspace: nextActive,
        projects:        [],
        loading:         false,
      });
      if (nextActive) get().fetchProjects(nextActive._id);
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  fetchProjects: async (workspaceId) => {
    set({ loading: true, error: null });
    try {
      const { projects } = await svc.fetchProjects(workspaceId);
      set({ projects, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  setActiveProject: (project) => set({ activeProject: project }),

  createProject: async (data, currentUser) => {
    const { activeWorkspace } = get();
    if (!activeWorkspace) throw new Error('No active workspace selected.');
    set({ loading: true, error: null });
    try {
      const { project } = await svc.createProject(activeWorkspace._id, data, currentUser);
      set((s) => ({ projects: [project, ...s.projects], loading: false }));
      return project;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  updateProject: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const { project } = await svc.updateProject(id, data);
      set((s) => ({
        projects:      s.projects.map((p) => (p._id === id ? project : p)),
        activeProject: s.activeProject?._id === id ? project : s.activeProject,
        loading:       false,
      }));
      return project;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  deleteProject: async (id) => {
    set({ loading: true, error: null });
    try {
      await svc.deleteProject(id);
      set((s) => ({
        projects:      s.projects.filter((p) => p._id !== id),
        activeProject: s.activeProject?._id === id ? null : s.activeProject,
        loading:       false,
      }));
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
}));

export default useWorkspaceStore;
