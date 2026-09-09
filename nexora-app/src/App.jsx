import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';

// Stores
import useAuthStore        from './store/authStore';
import useWorkspaceStore   from './store/workspaceStore';
import useNotificationStore from './store/notificationStore';

// Layout
import AppShell       from './components/layout/AppShell';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Auth pages (public)
import LoginPage    from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Protected pages
import DashboardPage      from './pages/DashboardPage';
import WorkspacePage      from './pages/WorkspacePage';
import ProjectsPage       from './pages/ProjectsPage';
import BoardPage          from './pages/BoardPage';
import AnalyticsPage      from './pages/AnalyticsPage';
import NotificationsPage  from './pages/NotificationsPage';
import ProfilePage        from './pages/ProfilePage';

// Redirect unauthenticated users to /login
function PublicOnlyRoute({ children }) {
  const { user } = useAuthStore();
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  const { loadUser, user }             = useAuthStore();
  const { fetchWorkspaces }            = useWorkspaceStore();
  const { fetchNotifications }         = useNotificationStore();

  // 1. Restore session from localStorage on first load
  useEffect(() => { loadUser(); }, []);

  // 2. Bootstrap global data once user is known
  useEffect(() => {
    if (user) {
      fetchWorkspaces();
      fetchNotifications();
    }
  }, [user?._id]);

  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public routes ──────────────────────────────────────── */}
        <Route path="/login"    element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
        <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />

        {/* ── Protected routes (inside AppShell with Sidebar) ─────── */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute><AppShell><DashboardPage /></AppShell></ProtectedRoute>}
        />
        <Route
          path="/workspace"
          element={<ProtectedRoute><AppShell><WorkspacePage /></AppShell></ProtectedRoute>}
        />
        <Route
          path="/projects"
          element={<ProtectedRoute><AppShell><ProjectsPage /></AppShell></ProtectedRoute>}
        />
        {/* /board/:projectId — project-specific Kanban board */}
        <Route
          path="/board/:projectId"
          element={<ProtectedRoute><AppShell><BoardPage /></AppShell></ProtectedRoute>}
        />
        {/* /board — default board (falls back to proj_001) */}
        <Route
          path="/board"
          element={<ProtectedRoute><AppShell><BoardPage /></AppShell></ProtectedRoute>}
        />
        <Route
          path="/analytics"
          element={<ProtectedRoute><AppShell><AnalyticsPage /></AppShell></ProtectedRoute>}
        />
        <Route
          path="/notifications"
          element={<ProtectedRoute><AppShell><NotificationsPage /></AppShell></ProtectedRoute>}
        />
        <Route
          path="/profile"
          element={<ProtectedRoute><AppShell><ProfilePage /></AppShell></ProtectedRoute>}
        />

        {/* ── Default redirects ────────────────────────────────────── */}
        <Route path="/"  element={<Navigate to="/dashboard" replace />} />
        <Route path="*"  element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
