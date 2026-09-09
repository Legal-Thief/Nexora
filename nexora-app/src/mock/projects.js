import { loadFromStorage, saveToStorage } from '../lib/storage';
const KEY = 'nexora_projects';
const SEED = [
  {
    _id: 'proj_001', workspace: 'ws_001', name: 'Nexora v2.0',
    description: 'Full-stack rebuild of the Nexora platform with real-time features, RBAC, and analytics',
    emoji: '🚀', status: 'active',
    createdBy: { _id: 'user_001', name: 'Tanishq Patel' },
    members: [
      { _id: 'user_001', name: 'Tanishq Patel', role: 'project_manager' },
      { _id: 'user_002', name: 'Tanmai Pahwa',  role: 'designer' },
      { _id: 'user_003', name: 'Udita Singh',   role: 'developer' },
      { _id: 'user_004', name: 'Vidita Sharma', role: 'qa' },
    ],
    deadline: '2026-12-31T00:00:00.000Z', tasksTotal: 48, tasksDone: 21,
    createdAt: '2024-01-15T09:00:00.000Z', updatedAt: '2024-08-20T14:00:00.000Z',
  },
  {
    _id: 'proj_002', workspace: 'ws_001', name: 'Mobile App',
    description: 'React Native mobile companion app for Nexora workspace management on iOS and Android',
    emoji: '📱', status: 'active',
    createdBy: { _id: 'user_001', name: 'Tanishq Patel' },
    members: [
      { _id: 'user_001', name: 'Tanishq Patel', role: 'project_manager' },
      { _id: 'user_003', name: 'Udita Singh',   role: 'developer' },
    ],
    deadline: '2027-03-31T00:00:00.000Z', tasksTotal: 30, tasksDone: 8,
    createdAt: '2024-03-01T09:00:00.000Z', updatedAt: '2024-08-10T11:00:00.000Z',
  },
  {
    _id: 'proj_003', workspace: 'ws_001', name: 'API Documentation',
    description: 'Comprehensive REST API docs with examples, SDKs, and developer guides',
    emoji: '📖', status: 'completed',
    createdBy: { _id: 'user_002', name: 'Tanmai Pahwa' },
    members: [
      { _id: 'user_002', name: 'Tanmai Pahwa',  role: 'project_manager' },
      { _id: 'user_003', name: 'Udita Singh',   role: 'developer' },
    ],
    deadline: '2024-09-30T00:00:00.000Z', tasksTotal: 15, tasksDone: 15,
    createdAt: '2024-04-01T09:00:00.000Z', updatedAt: '2024-09-28T16:00:00.000Z',
  },
  {
    _id: 'proj_004', workspace: 'ws_002', name: 'Brand Redesign',
    description: 'Full visual identity refresh — logo, design system, component library, and marketing site',
    emoji: '🎨', status: 'active',
    createdBy: { _id: 'user_002', name: 'Tanmai Pahwa' },
    members: [
      { _id: 'user_002', name: 'Tanmai Pahwa',  role: 'project_manager' },
      { _id: 'user_004', name: 'Vidita Sharma', role: 'qa' },
    ],
    deadline: '2026-10-31T00:00:00.000Z', tasksTotal: 22, tasksDone: 10,
    createdAt: '2024-02-15T09:00:00.000Z', updatedAt: '2024-08-05T09:00:00.000Z',
  },
];
export function getProjects()      { return loadFromStorage(KEY, SEED); }
export function saveProjects(data) { saveToStorage(KEY, data); }
