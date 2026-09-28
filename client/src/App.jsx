

import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext.jsx";

import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ProjectsPage from "./pages/ProjectsPage.jsx";
import ProjectPage from "./pages/ProjectPage.jsx";
import AnalyticsPage from "./pages/AnalyticsPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import MembersPage from "./pages/MembersPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import WorkspaceSettingsPage from "./pages/WorkspaceSettingsPage.jsx";
import WorkspaceNewPage from "./pages/WorkspaceNewPage.jsx";
import AcceptInvitePage from "./pages/AcceptInvitePage.jsx";

import Sidebar from "./components/Sidebar.jsx";
import Navbar from "./components/Navbar.jsx";

import { getWorkspaces } from "./api/workspace.js";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  
  if (loading) return null;

  
  if (!user) return <Navigate to="/login" replace />;

  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (user) return <Navigate to="/app/dashboard" replace />;

  return children;
}

function AppLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [workspaces, setWorkspaces] = useState([]);
  const [currentWorkspace, setCurrentWorkspace] = useState(null);

  
  const pageTitles = {
    "/app/dashboard":     "Dashboard",
    "/app/projects":      "Projects",
    "/app/analytics":     "Analytics",
    "/app/notifications": "Notifications",
    "/app/members":       "Members",
    "/app/settings":      "Settings",
    "/app/profile":       "Profile",
  };

  const pageTitle = pageTitles[location.pathname] || "Nexora";

  
  useEffect(() => {
    getWorkspaces()
      .then((res) => {
        const ws = res.data.workspaces || [];
        setWorkspaces(ws);

        
        const savedId = localStorage.getItem("currentWorkspaceId");
        const saved = ws.find((w) => w._id === savedId);
        setCurrentWorkspace(saved || ws[0] || null);
      })
      .catch(() => {});
  }, []);

  const handleSelectWorkspace = (workspace) => {
    setCurrentWorkspace(workspace);
    localStorage.setItem("currentWorkspaceId", workspace._id);
  };

  return (
    <div className="app-shell">
      
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentWorkspace={currentWorkspace}
        workspaces={workspaces}
        onSelectWorkspace={handleSelectWorkspace}
      />

      
      <div className="main-content">
        
        <Navbar
          title={pageTitle}
          onMenuClick={() => setSidebarOpen(true)}
        />

        
        <div className="page-content">
          
          <Outlet context={{ currentWorkspace, workspaces, setWorkspaces, setCurrentWorkspace }} />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={<PublicRoute><LoginPage /></PublicRoute>}
        />
        <Route
          path="/register"
          element={<PublicRoute><RegisterPage /></PublicRoute>}
        />

        
        <Route path="/invite/:token" element={<AcceptInvitePage />} />

        
        <Route
          path="/workspace/new"
          element={<ProtectedRoute><WorkspaceNewPage /></ProtectedRoute>}
        />

        
        <Route
          path="/app"
          element={<ProtectedRoute><AppLayout /></ProtectedRoute>}
        >
          
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard"     element={<DashboardPage />} />
          <Route path="projects"      element={<ProjectsPage />} />
          <Route path="projects/:id"  element={<ProjectPage />} />
          <Route path="analytics"     element={<AnalyticsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="members"       element={<MembersPage />} />
          <Route path="settings"      element={<WorkspaceSettingsPage />} />
          <Route path="profile"       element={<ProfilePage />} />
        </Route>

        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
