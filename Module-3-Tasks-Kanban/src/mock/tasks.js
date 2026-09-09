/**
 * Mock Tasks — Nexora Module 3
 *
 * Schema mirrors the real Nexora Task model:
 * { _id, title, description, project, workspace, assignee, status,
 *   priority, deadline, labels, position, __v, createdAt, updatedAt }
 *
 * RBAC — who can do what:
 *   project_manager : full control (create, update, delete, assign)
 *   developer       : can update status of own tasks, create tasks
 *   designer        : can update status of design tasks, create tasks
 *   qa              : can mark tasks done, update status, comment
 *
 * Status values  : TODO | IN_PROGRESS | REVIEW | DONE
 * Priority values: low | medium | high | urgent
 */

export const COLUMNS = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'];

export const COLUMN_LABELS = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  REVIEW: 'In Review',
  DONE: 'Done',
};

export const COLUMN_COLORS = {
  TODO: '#71717a',
  IN_PROGRESS: '#3b82f6',
  REVIEW: '#f59e0b',
  DONE: '#22c55e',
};

export const PRIORITY_CONFIG = {
  low:    { label: 'Low',    color: '#22c55e', border: 'border-l-green-500' },
  medium: { label: 'Medium', color: '#3b82f6', border: 'border-l-blue-500' },
  high:   { label: 'High',   color: '#f59e0b', border: 'border-l-amber-500' },
  urgent: { label: 'Urgent', color: '#ef4444', border: 'border-l-red-500' },
};

export let mockTasks = [
  {
    _id: 'task_001',
    title: 'Design authentication flow',
    description: 'Create wireframes and high-fidelity mockups for the login, register, and forgot-password screens. Deliver Figma file with component library.',
    project: 'proj_001',
    workspace: 'ws_001',
    assignee: { _id: 'user_002', name: 'Priya Mehta', projectRole: 'designer' },
    status: 'DONE',
    priority: 'high',
    deadline: '2024-03-15T00:00:00.000Z',
    labels: ['design', 'auth'],
    position: 0,
    __v: 3,
    createdAt: '2024-02-01T09:00:00.000Z',
    updatedAt: '2024-03-14T16:00:00.000Z',
  },
  {
    _id: 'task_002',
    title: 'Implement JWT authentication',
    description: 'Set up JWT token generation using RS256 algorithm. Implement access token (15m) + refresh token (7d) rotation. Add token blacklist on logout.',
    project: 'proj_001',
    workspace: 'ws_001',
    assignee: { _id: 'user_001', name: 'Tanishq Sharma', projectRole: 'project_manager' },
    status: 'DONE',
    priority: 'urgent',
    deadline: '2024-03-20T00:00:00.000Z',
    labels: ['backend', 'auth', 'security'],
    position: 1,
    __v: 5,
    createdAt: '2024-02-05T09:00:00.000Z',
    updatedAt: '2024-03-19T18:00:00.000Z',
  },
  {
    _id: 'task_003',
    title: 'Build Kanban board UI',
    description: 'Create drag-and-drop Kanban board using HTML5 native DnD API. Implement 4 columns (TODO, IN_PROGRESS, REVIEW, DONE) with task cards and task modal.',
    project: 'proj_001',
    workspace: 'ws_001',
    assignee: { _id: 'user_001', name: 'Tanishq Sharma', projectRole: 'project_manager' },
    status: 'REVIEW',
    priority: 'high',
    deadline: '2026-09-10T00:00:00.000Z',
    labels: ['frontend', 'kanban'],
    position: 0,
    __v: 2,
    createdAt: '2024-02-10T09:00:00.000Z',
    updatedAt: '2026-08-20T10:00:00.000Z',
  },
  {
    _id: 'task_004',
    title: 'Real-time collaboration with Socket.io',
    description: 'Integrate Socket.io for live task updates. Emit events: task:created, task:updated, task:deleted, task:moved. Handle reconnection and event replay.',
    project: 'proj_001',
    workspace: 'ws_001',
    assignee: { _id: 'user_001', name: 'Tanishq Sharma', projectRole: 'project_manager' },
    status: 'IN_PROGRESS',
    priority: 'urgent',
    deadline: '2026-09-20T00:00:00.000Z',
    labels: ['backend', 'realtime', 'socket'],
    position: 0,
    __v: 1,
    createdAt: '2024-02-15T09:00:00.000Z',
    updatedAt: '2026-08-22T09:00:00.000Z',
  },
  {
    _id: 'task_005',
    title: 'Analytics dashboard charts',
    description: 'Implement Recharts-based analytics: task completion pie chart, weekly progress bar chart, team workload stacked bar, and project health score table.',
    project: 'proj_001',
    workspace: 'ws_001',
    assignee: { _id: 'user_003', name: 'Rohit Singh', projectRole: 'developer' },
    status: 'IN_PROGRESS',
    priority: 'medium',
    deadline: '2026-09-25T00:00:00.000Z',
    labels: ['frontend', 'analytics', 'recharts'],
    position: 1,
    __v: 0,
    createdAt: '2024-02-20T09:00:00.000Z',
    updatedAt: '2026-08-18T14:00:00.000Z',
  },
  {
    _id: 'task_006',
    title: 'Set up CI/CD pipeline',
    description: 'Configure GitHub Actions workflow for: lint → test → build → deploy to staging. Add branch protection rules and PR required checks.',
    project: 'proj_001',
    workspace: 'ws_001',
    assignee: { _id: 'user_004', name: 'Ananya Patel', projectRole: 'qa' },
    status: 'IN_PROGRESS',
    priority: 'medium',
    deadline: '2026-09-15T00:00:00.000Z',
    labels: ['devops', 'github-actions'],
    position: 2,
    __v: 0,
    createdAt: '2024-02-22T09:00:00.000Z',
    updatedAt: '2026-08-19T11:00:00.000Z',
  },
  {
    _id: 'task_007',
    title: 'Write OpenAPI 3.0 documentation',
    description: 'Document all REST endpoints with request/response schemas using OpenAPI 3.0. Publish to /api-docs using Swagger UI. Cover auth, tasks, workspaces, projects.',
    project: 'proj_001',
    workspace: 'ws_001',
    assignee: { _id: 'user_002', name: 'Priya Mehta', projectRole: 'designer' },
    status: 'REVIEW',
    priority: 'low',
    deadline: '2026-10-01T00:00:00.000Z',
    labels: ['docs', 'openapi'],
    position: 1,
    __v: 1,
    createdAt: '2024-03-01T09:00:00.000Z',
    updatedAt: '2026-08-21T09:00:00.000Z',
  },
  {
    _id: 'task_008',
    title: 'Notification system',
    description: 'Build in-app notification center. Types: task_assigned, comment_added, invitation_received, task_status_changed. Support real-time via Socket.io and read/unread state.',
    project: 'proj_001',
    workspace: 'ws_001',
    assignee: { _id: 'user_003', name: 'Rohit Singh', projectRole: 'developer' },
    status: 'TODO',
    priority: 'medium',
    deadline: '2026-10-10T00:00:00.000Z',
    labels: ['backend', 'frontend', 'notifications'],
    position: 0,
    __v: 0,
    createdAt: '2024-03-05T09:00:00.000Z',
    updatedAt: '2024-03-05T09:00:00.000Z',
  },
  {
    _id: 'task_009',
    title: 'Mobile responsive layout',
    description: 'Audit all pages for mobile responsiveness. Target breakpoints: sm (640px), md (768px), lg (1024px). Fix Kanban board horizontal scroll on mobile.',
    project: 'proj_001',
    workspace: 'ws_001',
    assignee: { _id: 'user_002', name: 'Priya Mehta', projectRole: 'designer' },
    status: 'TODO',
    priority: 'medium',
    deadline: '2026-10-15T00:00:00.000Z',
    labels: ['frontend', 'responsive', 'mobile'],
    position: 1,
    __v: 0,
    createdAt: '2024-03-08T09:00:00.000Z',
    updatedAt: '2024-03-08T09:00:00.000Z',
  },
  {
    _id: 'task_010',
    title: 'Performance optimization',
    description: 'Audit bundle size with vite-bundle-visualizer. Implement lazy loading for all routes. Add React Query caching for API responses. Target Lighthouse score > 90.',
    project: 'proj_001',
    workspace: 'ws_001',
    assignee: { _id: 'user_001', name: 'Tanishq Sharma', projectRole: 'project_manager' },
    status: 'TODO',
    priority: 'low',
    deadline: '2026-10-30T00:00:00.000Z',
    labels: ['performance', 'optimization'],
    position: 2,
    __v: 0,
    createdAt: '2024-03-10T09:00:00.000Z',
    updatedAt: '2024-03-10T09:00:00.000Z',
  },
  {
    _id: 'task_011',
    title: 'User onboarding flow',
    description: 'Create guided onboarding tour for new users. Steps: create workspace → invite members → create first project → add first task. Use a step-by-step modal overlay.',
    project: 'proj_001',
    workspace: 'ws_001',
    assignee: null,
    status: 'TODO',
    priority: 'high',
    deadline: '2026-11-01T00:00:00.000Z',
    labels: ['frontend', 'ux', 'onboarding'],
    position: 3,
    __v: 0,
    createdAt: '2024-03-12T09:00:00.000Z',
    updatedAt: '2024-03-12T09:00:00.000Z',
  },
  {
    _id: 'task_012',
    title: 'RBAC role management UI',
    description: 'Admin UI for workspace owners to manage member roles. Show permission matrix. Allow promote/demote with confirmation dialog. Restrict non-owners from accessing settings.',
    project: 'proj_001',
    workspace: 'ws_001',
    assignee: { _id: 'user_004', name: 'Ananya Patel', projectRole: 'qa' },
    status: 'TODO',
    priority: 'high',
    deadline: '2026-11-10T00:00:00.000Z',
    labels: ['frontend', 'rbac', 'admin'],
    position: 4,
    __v: 0,
    createdAt: '2024-03-15T09:00:00.000Z',
    updatedAt: '2024-03-15T09:00:00.000Z',
  }
];

// ─── localStorage persistence layer ──────────────────────────────────────────
// Added by CRUD upgrade — DO NOT import from this file directly in components.
// All access must go through taskService.js.

import { loadFromStorage, saveToStorage } from '../lib/storage';

const TASKS_KEY = 'nexora_tasks';

/**
 * Get tasks from localStorage, falling back to the seed array above.
 * Called once by the service on every read operation.
 */
export function getTasks() {
  return loadFromStorage(TASKS_KEY, mockTasks);
}

/**
 * Persist the full tasks array to localStorage.
 * Called by the service after every mutation.
 */
export function saveTasks(tasks) {
  saveToStorage(TASKS_KEY, tasks);
}
