

import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  BarChart2,
  Bell,
  Users,
  Settings,
  User,
  ChevronDown,
  ChevronUp,
  Plus,
} from "lucide-react";

const NAV_LINKS = [
  { to: "/app/dashboard",      label: "Dashboard",     icon: LayoutDashboard },
  { to: "/app/projects",       label: "Projects",      icon: FolderKanban },
  { to: "/app/analytics",      label: "Analytics",     icon: BarChart2 },
  { to: "/app/notifications",  label: "Notifications", icon: Bell },
  { to: "/app/members",        label: "Members",       icon: Users },
  { to: "/app/settings",       label: "Settings",      icon: Settings },
  { to: "/app/profile",        label: "Profile",       icon: User },
];

function Sidebar({ isOpen, onClose, currentWorkspace, workspaces, onSelectWorkspace }) {
  const navigate = useNavigate();
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);

  const handleSelectWorkspace = (workspace) => {
    onSelectWorkspace(workspace);
    setShowWorkspaceMenu(false);
  };

  return (
    <>
      
      <div
        className={`sidebar-overlay ${isOpen ? "visible" : ""}`}
        onClick={onClose}
      />

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        
        <div className="sidebar-logo">
          <div className="sidebar-logo-text">
            Nexora<span>.</span>
          </div>
        </div>

        
        {currentWorkspace && (
          <div style={{ padding: "12px 12px 0" }}>
            <button
              className="workspace-selector"
              style={{ width: "100%", textAlign: "left" }}
              onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div className="workspace-selector-name">{currentWorkspace.name}</div>
                  <div className="workspace-selector-role">Workspace</div>
                </div>
                {showWorkspaceMenu ? (
                  <ChevronUp size={14} color="rgba(255,255,255,0.5)" />
                ) : (
                  <ChevronDown size={14} color="rgba(255,255,255,0.5)" />
                )}
              </div>
            </button>

            
            {showWorkspaceMenu && (
              <div
                style={{
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: 6,
                  marginTop: 4,
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {workspaces.map((ws) => (
                  <button
                    key={ws._id}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "8px 12px",
                      background: ws._id === currentWorkspace._id ? "rgba(99,102,241,0.3)" : "none",
                      border: "none",
                      cursor: "pointer",
                      color: "white",
                      fontSize: "0.825rem",
                    }}
                    onClick={() => handleSelectWorkspace(ws)}
                  >
                    {ws.name}
                  </button>
                ))}
                <button
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "8px 12px",
                    background: "none",
                    border: "none",
                    borderTop: "1px solid rgba(255,255,255,0.1)",
                    cursor: "pointer",
                    color: "#a5b4fc",
                    fontSize: "0.825rem",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                  onClick={() => { navigate("/workspace/new"); setShowWorkspaceMenu(false); }}
                >
                  <Plus size={13} />
                  New workspace
                </button>
              </div>
            )}
          </div>
        )}

        
        <div className="sidebar-section">
          <div className="sidebar-section-label">Navigation</div>
          <nav className="sidebar-nav">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? "active" : ""}`
                  }
                  onClick={onClose}
                >
                  <Icon size={16} />
                  {link.label}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
