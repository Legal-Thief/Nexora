import React from 'react';

function formatRelativeTime(dateString) {
  const diff = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} minute${mins > 1 ? 's' : ''} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}

const getDotColor = (type) => {
  switch (type) {
    case 'task_assigned': return 'bg-indigo-500';
    case 'comment_added': return 'bg-emerald-500';
    case 'invitation_received': return 'bg-amber-500';
    case 'task_status_changed': return 'bg-violet-500';
    default: return 'bg-slate-500';
  }
};

export default function ActivityFeed({ notifications = [] }) {
  const feedItems = notifications.slice(0, 5);

  if (feedItems.length === 0) {
    return (
      <div className="text-sm text-slate-400 p-4 text-center">
        No recent activity.
      </div>
    );
  }

  return (
    <div className="relative pl-3 space-y-6 before:absolute before:inset-y-0 before:left-3 before:w-px before:bg-slate-800">
      {feedItems.map((item) => {
        const initials = item.actor?.name?.substring(0, 2).toUpperCase() || 'U';
        
        return (
          <div key={item._id} className="relative flex gap-4">
            <div className={`absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full ring-4 ring-slate-900 ${getDotColor(item.type)}`} />
            
            <div className="flex-shrink-0 ml-4">
              <div className="w-8 h-8 rounded-full bg-slate-800 text-xs font-medium text-slate-300 flex items-center justify-center">
                {initials}
              </div>
            </div>
            
            <div className="flex-1 min-w-0 py-1.5">
              <p className="text-sm text-slate-300">
                <span className="font-medium text-slate-100">{item.actor?.name}</span>{' '}
                <span className="text-slate-400">{item.title.toLowerCase()}</span>
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {formatRelativeTime(item.createdAt)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}


