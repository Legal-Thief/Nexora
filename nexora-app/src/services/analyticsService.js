import { getNotifications, saveNotifications } from '../mock/notifications';
import { mockWeeklyProgress, mockTeamWorkload, mockProjectHealth } from '../mock/analytics';
import { loadFromStorage } from '../lib/storage';

const delay = (ms = 400) => new Promise(r => setTimeout(r, ms));

const SEED_TASKS = [
  { status:'DONE',        priority:'high',   project:'proj_001', assignee:{_id:'user_001',name:'Tanishq Patel'} },
  { status:'DONE',        priority:'medium', project:'proj_001', assignee:{_id:'user_002',name:'Tanmai Pahwa'} },
  { status:'DONE',        priority:'medium', project:'proj_001', assignee:{_id:'user_001',name:'Tanishq Patel'} },
  { status:'IN_PROGRESS', priority:'urgent', project:'proj_001', assignee:{_id:'user_003',name:'Udita Singh'} },
  { status:'IN_PROGRESS', priority:'high',   project:'proj_001', assignee:{_id:'user_001',name:'Tanishq Patel'} },
  { status:'IN_PROGRESS', priority:'medium', project:'proj_001', assignee:{_id:'user_002',name:'Tanmai Pahwa'} },
  { status:'REVIEW',      priority:'high',   project:'proj_001', assignee:{_id:'user_002',name:'Tanmai Pahwa'} },
  { status:'REVIEW',      priority:'low',    project:'proj_001', assignee:{_id:'user_004',name:'Vidita Sharma'} },
  { status:'TODO',        priority:'medium', project:'proj_001', assignee:{_id:'user_003',name:'Udita Singh'} },
  { status:'TODO',        priority:'high',   project:'proj_001', assignee:null },
  { status:'DONE',        priority:'low',    project:'proj_001', assignee:{_id:'user_004',name:'Vidita Sharma'} },
  { status:'DONE',        priority:'high',   project:'proj_001', assignee:{_id:'user_003',name:'Udita Singh'} },
];

function getLiveTasks() { return loadFromStorage('nexora_tasks', SEED_TASKS); }

export const getAnalyticsSummary = async (workspaceId = 'ws_001') => {
  await delay(350);
  const tasks = getLiveTasks();
  const total   = tasks.length;
  const done    = tasks.filter(t => t.status === 'DONE').length;
  const prog    = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const review  = tasks.filter(t => t.status === 'REVIEW').length;
  const todo    = tasks.filter(t => t.status === 'TODO').length;
  const now     = Date.now();
  const overdue = tasks.filter(t => t.deadline && new Date(t.deadline).getTime() < now && t.status !== 'DONE').length;
  const rate    = total > 0 ? parseFloat(((done / total) * 100).toFixed(1)) : 0;
  const activeProjSet = new Set(tasks.filter(t => t.status !== 'DONE').map(t => t.project));
  return { workspaceId, period:'all-time', totalTasks:total, completedTasks:done, inProgressTasks:prog, reviewTasks:review, todoTasks:todo, overdueTasks:overdue, completionRate:rate, activeProjects:activeProjSet.size, completedProjects:1, totalMembers:4, generatedAt:new Date().toISOString() };
};

export const getTasksByStatus = async () => {
  await delay(300);
  const tasks = getLiveTasks();
  return [
    { name:'To Do',       value:tasks.filter(t=>t.status==='TODO').length,        fill:'#71717a' },
    { name:'In Progress', value:tasks.filter(t=>t.status==='IN_PROGRESS').length,  fill:'#3b82f6' },
    { name:'In Review',   value:tasks.filter(t=>t.status==='REVIEW').length,       fill:'#f59e0b' },
    { name:'Done',        value:tasks.filter(t=>t.status==='DONE').length,         fill:'#22c55e' },
  ];
};

export const getWeeklyProgress = async () => { await delay(300); return mockWeeklyProgress; };
export const getTeamWorkload   = async () => { await delay(300); return mockTeamWorkload; };
export const getProjectHealth  = async () => { await delay(300); return mockProjectHealth; };

export const fetchNotifications = async () => {
  await delay(350);
  const all = getNotifications();
  return { notifications: all, unreadCount: all.filter(n => !n.read).length };
};
export const createNotification = async (data) => {
  await delay(250);
  if (!data.title?.trim()) throw new Error('Title required.');
  const notification = { _id:`notif_${crypto.randomUUID()}`, type:data.type||'task_assigned', title:data.title.trim(), message:data.message?.trim()||'', actor:data.actor||null, recipient:data.recipient||null, workspace:data.workspace||'ws_001', project:data.project||null, task:data.task||null, read:false, createdAt:new Date().toISOString() };
  saveNotifications([notification, ...getNotifications()]);
  return { notification };
};
export const markNotificationRead = async (id) => {
  await delay(150);
  const all = getNotifications();
  const idx = all.findIndex(n => n._id === id);
  if (idx === -1) throw new Error('Notification not found.');
  const updated = [...all]; updated[idx] = {...all[idx], read:true};
  saveNotifications(updated); return { success:true };
};
export const markAllRead = async () => {
  await delay(250);
  saveNotifications(getNotifications().map(n => ({...n, read:true}))); return { success:true };
};
export const deleteNotification = async (id) => {
  await delay(200);
  const all = getNotifications();
  if (!all.find(n => n._id === id)) throw new Error('Notification not found.');
  saveNotifications(all.filter(n => n._id !== id)); return { success:true };
};
