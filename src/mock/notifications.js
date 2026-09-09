import { loadFromStorage, saveToStorage } from '../lib/storage';
const KEY = 'nexora_notifications';

export const mockNotifications = [
  { _id:'notif_001', type:'task_assigned', title:'Task assigned to you', message:'Tanishq Patel assigned "Real-time collaboration with Socket.io" to you.', actor:{_id:'user_001',name:'Tanishq Patel'}, recipient:{_id:'user_003',name:'Udita Singh'}, workspace:'ws_001', project:'proj_001', task:'task_004', read:false, createdAt:new Date(Date.now()-900000).toISOString() },
  { _id:'notif_002', type:'comment_added', title:'New comment on task', message:'Tanmai Pahwa commented on "Build Kanban board UI": "Looks great, just one small fix needed in the drag handle!"', actor:{_id:'user_002',name:'Tanmai Pahwa'}, recipient:{_id:'user_001',name:'Tanishq Patel'}, workspace:'ws_001', project:'proj_001', task:'task_003', read:false, createdAt:new Date(Date.now()-2700000).toISOString() },
  { _id:'notif_003', type:'invitation_received', title:'Workspace invitation', message:'You have been invited to join "Design Studio" as a member by Tanmai Pahwa.', actor:{_id:'user_002',name:'Tanmai Pahwa'}, recipient:{_id:'user_003',name:'Udita Singh'}, workspace:'ws_002', project:null, task:null, read:true, createdAt:new Date(Date.now()-7200000).toISOString() },
  { _id:'notif_004', type:'task_status_changed', title:'Task moved to Review', message:'Udita Singh moved "Set up CI/CD pipeline" from In Progress to In Review.', actor:{_id:'user_003',name:'Udita Singh'}, recipient:{_id:'user_001',name:'Tanishq Patel'}, workspace:'ws_001', project:'proj_001', task:'task_006', read:true, createdAt:new Date(Date.now()-10800000).toISOString() },
  { _id:'notif_005', type:'task_assigned', title:'Task assigned to you', message:'Tanishq Patel assigned "RBAC role management UI" to you.', actor:{_id:'user_001',name:'Tanishq Patel'}, recipient:{_id:'user_004',name:'Vidita Sharma'}, workspace:'ws_001', project:'proj_001', task:'task_012', read:false, createdAt:new Date(Date.now()-18000000).toISOString() },
  { _id:'notif_006', type:'comment_added', title:'New comment on task', message:'Tanishq Patel replied to your comment on "Performance optimization": "Good catch, let me add memoization there."', actor:{_id:'user_001',name:'Tanishq Patel'}, recipient:{_id:'user_003',name:'Udita Singh'}, workspace:'ws_001', project:'proj_001', task:'task_010', read:true, createdAt:new Date(Date.now()-86400000).toISOString() },
  { _id:'notif_007', type:'member_joined', title:'New member joined', message:'Vidita Sharma joined the workspace "Nexora HQ".', actor:{_id:'user_004',name:'Vidita Sharma'}, recipient:{_id:'user_001',name:'Tanishq Patel'}, workspace:'ws_001', project:null, task:null, read:true, createdAt:new Date(Date.now()-172800000).toISOString() },
  { _id:'notif_008', type:'project_created', title:'New project created', message:'Tanishq Patel created the project "Mobile App" in Nexora HQ.', actor:{_id:'user_001',name:'Tanishq Patel'}, recipient:{_id:'user_002',name:'Tanmai Pahwa'}, workspace:'ws_001', project:'proj_002', task:null, read:true, createdAt:new Date(Date.now()-259200000).toISOString() },
];

export function getNotifications() {
  const notifs = loadFromStorage(KEY, null);
  if (!notifs || JSON.stringify(notifs).includes('Sharma') || JSON.stringify(notifs).includes('Mehta') || !JSON.stringify(notifs).includes('Tanishq Patel')) {
    saveNotifications(mockNotifications);
    return mockNotifications;
  }
  return notifs;
}

export function saveNotifications(data) {
  saveToStorage(KEY, data);
}
