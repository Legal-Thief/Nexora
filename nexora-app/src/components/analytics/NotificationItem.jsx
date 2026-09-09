import { Bell, MessageSquare, Mail, Activity, X, Check } from 'lucide-react';

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

const getIconForType = (type) => {
  switch (type) {
    case 'task_assigned':       return <Bell className="w-5 h-5 text-indigo-400" />;
    case 'comment_added':       return <MessageSquare className="w-5 h-5 text-emerald-400" />;
    case 'invitation_received': return <Mail className="w-5 h-5 text-amber-400" />;
    case 'task_status_changed': return <Activity className="w-5 h-5 text-violet-400" />;
    default:                    return <Bell className="w-5 h-5 text-slate-400" />;
  }
};

export default function NotificationItem({ notification, onMarkRead, onDelete }) {
  // Use _id consistently — mock data uses _id to match MongoDB schema
  const { _id, type, title, message, read, createdAt } = notification;

  return (
    <div
      className={`group relative p-4 flex gap-4 border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors ${
        read ? 'opacity-70' : 'bg-slate-800/10'
      }`}
    >
      {!read && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-md" />
      )}

      <div className="flex-shrink-0 mt-1">
        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
          {getIconForType(type)}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className={`text-sm font-medium ${read ? 'text-slate-300' : 'text-slate-100'}`}>
              {title}
            </h4>
            <p className="text-sm text-slate-400 mt-1 line-clamp-2">{message}</p>
          </div>
          <span className="text-xs text-slate-500 whitespace-nowrap flex-shrink-0">
            {formatRelativeTime(createdAt)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {!read && (
          <button
            onClick={() => onMarkRead(_id)}
            className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-md transition-colors"
            title="Mark as read"
          >
            <Check className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={() => onDelete(_id)}
          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
          title="Delete notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

