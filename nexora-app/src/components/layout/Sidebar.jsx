import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Building2, FolderKanban, Kanban,
  BarChart3, Bell, User, LogOut, RotateCcw, ChevronRight
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useNotificationStore from '../../store/notificationStore';
import { resetNexoraData } from '../../lib/resetDemo';

const navSections = [
  {
    items: [
      { to: '/dashboard',     icon: LayoutDashboard, label: 'Dashboard'  },
      { to: '/workspace',     icon: Building2,       label: 'Workspaces' },
      { to: '/projects',      icon: FolderKanban,    label: 'Projects'   },
    ],
  },
  {
    label: 'Work',
    items: [
      { to: '/board',         icon: Kanban,          label: 'Kanban Board' },
    ],
  },
  {
    label: 'Insights',
    items: [
      { to: '/analytics',     icon: BarChart3,       label: 'Analytics'     },
      { to: '/notifications', icon: Bell,            label: 'Notifications', badge: true },
    ],
  },
  {
    label: 'Account',
    items: [
      { to: '/profile',       icon: User,            label: 'Profile' },
    ],
  },
];

const getInitials = (name) =>
  name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

const avatarColors = {
  user_001: 'bg-indigo-600', user_002: 'bg-violet-600',
  user_003: 'bg-emerald-700', user_004: 'bg-amber-700',
};

export default function Sidebar({ onClose }) {
  const { user, logout } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleReset = () => {
    resetNexoraData();
    window.location.reload();
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
      isActive
        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
    }`;

  return (
    <aside className="flex flex-col h-full w-60 bg-slate-900 border-r border-slate-800 shrink-0">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800">
        <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <Kanban size={16} className="text-white" />
        </div>
        <div>
          <span className="text-slate-100 font-bold text-sm tracking-tight">Nexora</span>
          <p className="text-slate-500 text-[10px] font-medium">Project Management</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navSections.map((section, si) => (
          <div key={si}>
            {section.label && (
              <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-3 mb-1.5">
                {section.label}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map(({ to, icon: Icon, label, badge }) => (
                <NavLink key={to} to={to} className={linkClass} onClick={onClose}>
                  <Icon size={16} className="shrink-0" />
                  <span className="flex-1">{label}</span>
                  {badge && unreadCount > 0 && (
                    <span className="bg-indigo-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-3 pb-4 pt-3 border-t border-slate-800 space-y-1">
        {user && (
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800/50 mb-2">
            <div className={`w-7 h-7 rounded-full ${avatarColors[user._id] || 'bg-slate-700'} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
              {getInitials(user.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-slate-200 text-xs font-semibold truncate">{user.name}</p>
              <p className="text-slate-500 text-[10px] truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 text-sm font-medium transition-all"
        >
          <LogOut size={15} />
          <span>Sign out</span>
        </button>
        <button
          onClick={handleReset}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-slate-800 text-xs font-medium transition-all"
          title="Clear all nexora_* localStorage keys and reload with seed data"
        >
          <RotateCcw size={13} />
          <span>Reset demo data</span>
        </button>
      </div>
    </aside>
  );
}
