import { loadFromStorage, saveToStorage } from '../lib/storage';

const STORAGE_KEY_USERS       = 'nexora_users';
const STORAGE_KEY_CREDENTIALS = 'nexora_credentials';

const SEED_USERS = [
  // Demo account — shared credentials shown on login page
  { _id: 'user_000', name: 'Demo User',     email: 'demo@nexora.com',    profilePicture: null, workspaceRole: 'owner',  projectRole: 'project_manager', isActive: true,  lastSeen: new Date().toISOString(), createdAt: '2024-01-01T09:00:00.000Z' },
  // Team members
  { _id: 'user_001', name: 'Tanishq Patel', email: 'tanishq@nexora.com', profilePicture: null, workspaceRole: 'owner',  projectRole: 'project_manager', isActive: true,  lastSeen: new Date().toISOString(),               createdAt: '2024-01-15T09:00:00.000Z' },
  { _id: 'user_002', name: 'Tanmai Pahwa',  email: 'tanmai@nexora.com',  profilePicture: null, workspaceRole: 'admin',  projectRole: 'designer',        isActive: true,  lastSeen: new Date(Date.now()-3600000).toISOString(),  createdAt: '2024-02-20T10:30:00.000Z' },
  { _id: 'user_003', name: 'Udita Singh',   email: 'udita@nexora.com',   profilePicture: null, workspaceRole: 'member', projectRole: 'developer',       isActive: false, lastSeen: new Date(Date.now()-86400000).toISOString(), createdAt: '2024-03-10T08:00:00.000Z' },
  { _id: 'user_004', name: 'Vidita Sharma', email: 'vidita@nexora.com',  profilePicture: null, workspaceRole: 'member', projectRole: 'qa',              isActive: true,  lastSeen: new Date(Date.now()-7200000).toISOString(),  createdAt: '2024-03-18T11:00:00.000Z' },
];

const SEED_CREDENTIALS = [
  { email: 'demo@nexora.com',    password: 'password123' },
  { email: 'tanishq@nexora.com', password: 'password123' },
  { email: 'tanmai@nexora.com',  password: 'password123' },
  { email: 'udita@nexora.com',   password: 'password123' },
  { email: 'vidita@nexora.com',  password: 'password123' },
];

export function getUsers()                   { return loadFromStorage(STORAGE_KEY_USERS, SEED_USERS); }
export function saveUsers(users)             { saveToStorage(STORAGE_KEY_USERS, users); }
export function getCredentials()             { return loadFromStorage(STORAGE_KEY_CREDENTIALS, SEED_CREDENTIALS); }
export function saveCredentials(credentials) { saveToStorage(STORAGE_KEY_CREDENTIALS, credentials); }

export const WORKSPACE_PERMISSIONS = {
  owner:  ['manage_workspace','delete_workspace','invite_member','remove_member','manage_roles','create_project','delete_project','update_project','view_analytics'],
  admin:  ['invite_member','remove_member','create_project','delete_project','update_project','view_analytics'],
  member: ['view_project','create_task','update_own_task'],
};
export const PROJECT_PERMISSIONS = {
  project_manager: ['delete_task','assign_task','manage_project_members','close_project'],
  developer:       ['update_task_status','create_task','comment_on_task'],
  designer:        ['update_task_status','create_task','comment_on_task'],
  qa:              ['update_task_status','comment_on_task','mark_task_done'],
};
export function hasPermission(role, permission, scope = 'workspace') {
  const matrix = scope === 'workspace' ? WORKSPACE_PERMISSIONS : PROJECT_PERMISSIONS;
  return matrix[role]?.includes(permission) ?? false;
}