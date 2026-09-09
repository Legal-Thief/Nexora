import { resetNexoraData } from '../lib/resetDemo';
import { useEffect } from 'react';
import { Loader2, Bell, BellRing, CheckCheck } from 'lucide-react';
import { useNotificationStore } from '../store/notificationStore';
import NotificationItem from '../components/analytics/NotificationItem';

export default function Notifications() {
  const {
    notifications,
    unreadCount,
    loading,
    filter,
    setFilter,
    fetchNotifications,
    markRead,
    markAllRead,
    deleteNotification,
  } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const filteredNotifications = notifications.filter(n =>
    filter === 'unread' ? !n.read : true
  );

  return (
    <div className="p-8 max-w-4xl mx-auto min-h-screen bg-slate-950 text-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Bell className="text-indigo-400" size={24}/>
            Notification Center
            {unreadCount > 0 && (
              <span className="bg-indigo-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                {unreadCount} new
              </span>
            )}
          </h1>
          <p className="text-sm text-slate-400 mt-1">Stay updated on workspace activity</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-slate-900 p-1 rounded-lg border border-slate-800 flex">
            <button onClick={() => setFilter('all')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                filter === 'all' ? 'bg-slate-800 text-slate-100' : 'text-slate-400 hover:text-slate-200'
              }`}>
              All
            </button>
            <button onClick={() => setFilter('unread')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                filter === 'unread' ? 'bg-slate-800 text-slate-100' : 'text-slate-400 hover:text-slate-200'
              }`}>
              Unread
            </button>
          </div>

          <button onClick={markAllRead} disabled={unreadCount === 0 || loading}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 text-slate-300 rounded-lg hover:bg-slate-800 hover:text-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium">
            <CheckCheck className="w-4 h-4"/>
            Mark all read
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {loading && notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4"/>
            <p>Loading notifications…</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
              <BellRing className="w-8 h-8 text-slate-500"/>
            </div>
            <h3 className="text-lg font-medium text-slate-200 mb-1">You are all caught up!</h3>
            <p className="text-slate-400 text-sm max-w-sm">
              {filter === 'unread'
                ? "You don't have any unread notifications right now."
                : 'No notifications to show. Activity in your workspace will appear here.'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                onMarkRead={markRead}
                onDelete={deleteNotification}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={() => { resetNexoraData(); window.location.reload(); }}
          className="text-xs text-slate-600 hover:text-slate-400 transition px-3 py-1.5 rounded-lg hover:bg-slate-800"
          title="Removes nexora_notifications from localStorage — reloads with seed data"
        >
          ↺ Reset Demo Data
        </button>
      </div>
    </div>
  );
}
