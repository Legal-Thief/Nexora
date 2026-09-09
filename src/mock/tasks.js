import { loadFromStorage, saveToStorage } from "../lib/storage";

const TASKS_KEY = "nexora_tasks";

export const mockTasks = [
  {
    _id: "task_001",
    title: "Set up authentication system",
    description:
      "Implement JWT auth with refresh tokens. Include login, register, logout. Add protected route middleware. Write unit tests for auth middleware.",
    project: "proj_001",
    workspace: "ws_001",
    assignee: {
      _id: "user_001",
      name: "Tanishq Patel",
      projectRole: "project_manager",
    },
    status: "DONE",
    priority: "urgent",
    deadline: "2026-02-28T00:00:00.000Z",
    labels: ["backend", "auth"],
    position: 0,
    __v: 2,
    createdAt: "2024-01-20T09:00:00.000Z",
    updatedAt: "2024-02-25T14:00:00.000Z",
  },
  {
    _id: "task_002",
    title: "Design system and component library",
    description:
      "Build a reusable component library in Tailwind CSS. Define color tokens, spacing scale, and typography. Create Button, Input, Card, Modal, Badge, Avatar components.",
    project: "proj_001",
    workspace: "ws_001",
    assignee: {
      _id: "user_002",
      name: "Tanmai Pahwa",
      projectRole: "designer",
    },
    status: "DONE",
    priority: "high",
    deadline: "2026-03-15T00:00:00.000Z",
    labels: ["frontend", "design"],
    position: 1,
    __v: 1,
    createdAt: "2024-01-22T10:00:00.000Z",
    updatedAt: "2024-03-10T11:00:00.000Z",
  },
  {
    _id: "task_003",
    title: "Build Kanban board UI",
    description:
      "Create drag-and-drop Kanban board with four columns (To Do, In Progress, Review, Done). Support task cards with priority colors, assignee avatars, and deadline indicators.",
    project: "proj_001",
    workspace: "ws_001",
    assignee: {
      _id: "user_002",
      name: "Tanmai Pahwa",
      projectRole: "designer",
    },
    status: "DONE",
    priority: "high",
    deadline: "2026-04-01T00:00:00.000Z",
    labels: ["frontend", "ui"],
    position: 2,
    __v: 3,
    createdAt: "2024-02-01T09:00:00.000Z",
    updatedAt: "2024-03-28T16:00:00.000Z",
  },
  {
    _id: "task_004",
    title: "Real-time collaboration with Socket.io",
    description:
      "Implement real-time task updates using Socket.io. Broadcast task create/update/delete events to all connected workspace members. Handle reconnection gracefully.",
    project: "proj_001",
    workspace: "ws_001",
    assignee: {
      _id: "user_003",
      name: "Udita Singh",
      projectRole: "developer",
    },
    status: "IN_PROGRESS",
    priority: "urgent",
    deadline: "2026-06-30T00:00:00.000Z",
    labels: ["backend", "realtime"],
    position: 0,
    __v: 1,
    createdAt: "2024-02-10T09:00:00.000Z",
    updatedAt: "2024-04-05T10:00:00.000Z",
  },
  {
    _id: "task_005",
    title: "Workspace invitation system",
    description:
      "Build email invitation flow for workspace members. Support invite by email, role assignment, accept/decline workflow. Add invitation expiry after 7 days.",
    project: "proj_001",
    workspace: "ws_001",
    assignee: {
      _id: "user_001",
      name: "Tanishq Patel",
      projectRole: "project_manager",
    },
    status: "IN_PROGRESS",
    priority: "high",
    deadline: "2026-05-15T00:00:00.000Z",
    labels: ["backend", "email"],
    position: 1,
    __v: 1,
    createdAt: "2024-02-15T09:00:00.000Z",
    updatedAt: "2024-04-10T09:00:00.000Z",
  },
  {
    _id: "task_006",
    title: "Set up CI/CD pipeline",
    description:
      "Configure GitHub Actions for CI/CD. Run linting, tests, and build on every PR. Deploy to staging on merge to main. Deploy to production on version tags.",
    project: "proj_001",
    workspace: "ws_001",
    assignee: {
      _id: "user_003",
      name: "Udita Singh",
      projectRole: "developer",
    },
    status: "REVIEW",
    priority: "medium",
    deadline: "2026-04-30T00:00:00.000Z",
    labels: ["devops", "ci"],
    position: 0,
    __v: 2,
    createdAt: "2024-02-20T09:00:00.000Z",
    updatedAt: "2024-04-15T14:00:00.000Z",
  },
  {
    _id: "task_007",
    title: "Analytics dashboard implementation",
    description:
      "Build workspace analytics page with recharts. Show task completion rate, weekly progress chart, team workload bar chart, and project health indicators.",
    project: "proj_001",
    workspace: "ws_001",
    assignee: {
      _id: "user_002",
      name: "Tanmai Pahwa",
      projectRole: "designer",
    },
    status: "REVIEW",
    priority: "medium",
    deadline: "2026-07-15T00:00:00.000Z",
    labels: ["frontend", "analytics"],
    position: 1,
    __v: 1,
    createdAt: "2024-03-01T09:00:00.000Z",
    updatedAt: "2024-04-20T11:00:00.000Z",
  },
  {
    _id: "task_008",
    title: "Notification system",
    description:
      "Build in-app notification center. Support task_assigned, comment_added, member_joined, invitation_received, task_status_changed types. Mark as read individually or all at once. Delete notifications.",
    project: "proj_001",
    workspace: "ws_001",
    assignee: {
      _id: "user_001",
      name: "Tanishq Patel",
      projectRole: "project_manager",
    },
    status: "TODO",
    priority: "medium",
    deadline: "2026-08-01T00:00:00.000Z",
    labels: ["backend", "frontend"],
    position: 0,
    __v: 0,
    createdAt: "2024-03-05T09:00:00.000Z",
    updatedAt: "2024-03-05T09:00:00.000Z",
  },
  {
    _id: "task_009",
    title: "Mobile responsive layouts",
    description:
      "Audit all existing pages for mobile responsiveness. Fix sidebar collapse on mobile. Ensure Kanban board is scrollable on small screens. Test on 375px, 768px, 1024px breakpoints.",
    project: "proj_001",
    workspace: "ws_001",
    assignee: { _id: "user_004", name: "Vidita Sharma", projectRole: "qa" },
    status: "TODO",
    priority: "high",
    deadline: "2026-09-01T00:00:00.000Z",
    labels: ["frontend", "responsive"],
    position: 1,
    __v: 0,
    createdAt: "2024-03-08T09:00:00.000Z",
    updatedAt: "2024-03-08T09:00:00.000Z",
  },
  {
    _id: "task_010",
    title: "Performance optimization",
    description:
      "Profile the React app with React DevTools Profiler. Memoize heavy components. Add React.lazy + Suspense for route-level code splitting. Target Lighthouse score > 90.",
    project: "proj_001",
    workspace: "ws_001",
    assignee: {
      _id: "user_003",
      name: "Udita Singh",
      projectRole: "developer",
    },
    status: "TODO",
    priority: "medium",
    deadline: "2026-09-15T00:00:00.000Z",
    labels: ["performance", "frontend"],
    position: 2,
    __v: 0,
    createdAt: "2024-03-10T09:00:00.000Z",
    updatedAt: "2024-03-10T09:00:00.000Z",
  },
  {
    _id: "task_011",
    title: "Write integration test suite",
    description:
      "Set up Vitest + Testing Library. Write integration tests for auth flow, workspace CRUD, project CRUD, and task CRUD. Target 80% code coverage.",
    project: "proj_001",
    workspace: "ws_001",
    assignee: { _id: "user_004", name: "Vidita Sharma", projectRole: "qa" },
    status: "TODO",
    priority: "high",
    deadline: "2026-10-01T00:00:00.000Z",
    labels: ["testing", "qa"],
    position: 3,
    __v: 0,
    createdAt: "2024-03-12T09:00:00.000Z",
    updatedAt: "2024-03-12T09:00:00.000Z",
  },
  {
    _id: "task_012",
    title: "RBAC role management UI",
    description:
      "Admin UI for workspace owners to manage member roles. Show permission matrix. Allow promote/demote with confirmation dialog. Restrict non-owners from accessing settings.",
    project: "proj_001",
    workspace: "ws_001",
    assignee: { _id: "user_004", name: "Vidita Sharma", projectRole: "qa" },
    status: "TODO",
    priority: "high",
    deadline: "2026-11-10T00:00:00.000Z",
    labels: ["frontend", "rbac"],
    position: 4,
    __v: 0,
    createdAt: "2024-03-15T09:00:00.000Z",
    updatedAt: "2024-03-15T09:00:00.000Z",
  },
];

export function getTasks() {
  const tasks = loadFromStorage(TASKS_KEY, null);
  if (!tasks || JSON.stringify(tasks).includes('Sharma') && !JSON.stringify(tasks).includes('Vidita Sharma') || JSON.stringify(tasks).includes('Mehta') || !JSON.stringify(tasks).includes('Tanishq Patel')) {
    saveTasks(mockTasks);
    return mockTasks;
  }
  return tasks;
}
export function saveTasks(tasks) {
  saveToStorage(TASKS_KEY, tasks);
}
