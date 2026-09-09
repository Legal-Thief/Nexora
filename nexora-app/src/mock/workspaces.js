import { loadFromStorage, saveToStorage } from '../lib/storage';
const KEY = 'nexora_workspaces';
const SEED = [
  {
    _id: 'ws_001', name: 'Nexora HQ',
    description: 'Main product development workspace for the Nexora platform',
    owner: { _id: 'user_001', name: 'Tanishq Patel', email: 'tanishq@nexora.com' },
    members: [
      { _id: 'user_001', name: 'Tanishq Patel', email: 'tanishq@nexora.com', role: 'owner',  joinedAt: '2024-01-10T09:00:00.000Z' },
      { _id: 'user_002', name: 'Tanmai Pahwa',  email: 'tanmai@nexora.com',  role: 'admin',  joinedAt: '2024-01-12T10:00:00.000Z' },
      { _id: 'user_003', name: 'Udita Singh',   email: 'udita@nexora.com',   role: 'member', joinedAt: '2024-02-01T09:00:00.000Z' },
      { _id: 'user_004', name: 'Vidita Sharma', email: 'vidita@nexora.com',  role: 'member', joinedAt: '2024-02-15T11:00:00.000Z' },
    ],
    plan: 'pro', createdAt: '2024-01-10T09:00:00.000Z', updatedAt: '2024-08-01T12:00:00.000Z',
  },
  {
    _id: 'ws_002', name: 'Design Studio',
    description: 'UI/UX design and prototyping workspace for brand assets',
    owner: { _id: 'user_002', name: 'Tanmai Pahwa', email: 'tanmai@nexora.com' },
    members: [
      { _id: 'user_002', name: 'Tanmai Pahwa', email: 'tanmai@nexora.com', role: 'owner',  joinedAt: '2024-02-05T09:00:00.000Z' },
      { _id: 'user_003', name: 'Udita Singh',  email: 'udita@nexora.com',  role: 'member', joinedAt: '2024-02-10T10:00:00.000Z' },
    ],
    plan: 'free', createdAt: '2024-02-05T09:00:00.000Z', updatedAt: '2024-07-20T08:00:00.000Z',
  },
];
export function getWorkspaces()      { return loadFromStorage(KEY, SEED); }
export function saveWorkspaces(data) { saveToStorage(KEY, data); }
