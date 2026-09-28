import { useState, useEffect } from 'react';
import { Bell, CheckCheck, Trash2 } from 'lucide-react';
import { getNotifications, markRead, markAllRead, deleteNotification } from '../api/notification.js';
import { useNavigate } from 'react-router-dom';

function timeAgo(dateStr) {
  const now = new Date();
  const then = new Date(dateStr);
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const loadNotifications = async () => {
    try {
      const res = await getNotifications();
      setNotifications(res.data.notifications || []);
    } catch (err) {
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadNotifications(); }, []);

  
  const handleMarkRead = async (id) => {
    try {
      await markRead(id);
      setNotifications((prev) =>
        prev.map((n) => n._id === id ? { ...n, read: true } : n)
      );
    } catch (err) {}
  };

  
  const handleMarkAllRead = async () => {
    try {
      await markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {}
  };

  
  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {}
  };

  
  const handleClick = (notification) => {
    if (!notification.read) handleMarkRead(notification._id);
    if (notification.link) navigate(notification.link);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-subtitle">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
          </p>
        </div>
        
        {unreadCount > 0 && (
          <button className="secondary-button" onClick={handleMarkAllRead}>
            <CheckCheck size={16} /> Mark all as read
          </button>
        )}
      </div>

      <div className="card" style={{ padding: 0 }}>
        {loading ? (
          <div className="page-loading"><div className="spinner" /></div>
        ) : notifications.length === 0 ? (
          
          <div className="empty-state">
            <div className="empty-state-icon"><Bell size={24} /></div>
            <h3 className="empty-state-title">No notifications</h3>
            <p className="empty-state-desc">You're all caught up! Notifications will appear here.</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className={`notification-item ${!notification.read ? 'unread' : ''}`}
              onClick={() => handleClick(notification)}
            >
              
              {!notification.read && <div className="notification-dot" />}
              <div style={{ flex: 1 }}>
                <div className="notification-message">{notification.message}</div>
                <div className="notification-time" style={{ marginTop: 4 }}>
                  {timeAgo(notification.createdAt)}
                </div>
              </div>
              
              <button
                className="icon-button"
                onClick={(e) => { e.stopPropagation(); handleDelete(notification._id); }}
                title="Delete notification"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default NotificationsPage;
