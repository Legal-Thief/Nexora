export const COLUMNS = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'];
export const COLUMN_LABELS = { TODO: 'To Do', IN_PROGRESS: 'In Progress', REVIEW: 'In Review', DONE: 'Done' };
export const COLUMN_COLORS = { TODO: 'bg-slate-400', IN_PROGRESS: 'bg-blue-400', REVIEW: 'bg-purple-400', DONE: 'bg-emerald-400' };
export const PRIORITY_CONFIG = {
  low:    { label: 'Low',    borderClass: 'border-l-green-500' },
  medium: { label: 'Medium', borderClass: 'border-l-blue-500' },
  high:   { label: 'High',   borderClass: 'border-l-amber-500' },
  urgent: { label: 'Urgent', borderClass: 'border-l-red-500' },
};
export const ASSIGNEES = [
  { _id: 'user_001', name: 'Tanishq Patel',  projectRole: 'project_manager' },
  { _id: 'user_002', name: 'Tanmai Pahwa',   projectRole: 'designer' },
  { _id: 'user_003', name: 'Udita Singh',    projectRole: 'developer' },
  { _id: 'user_004', name: 'Vidita Sharma',  projectRole: 'qa' },
];
