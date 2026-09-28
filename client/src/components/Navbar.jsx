

import { Bell, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Avatar from "./Avatar.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getNotifications } from "../api/notification.js";

function Navbar({ title, onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);

  
  useEffect(() => {
    getNotifications()
      .then((res) => setUnreadCount(res.data.unreadCount || 0))
      .catch(() => {}); 
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      
      <div className="navbar-left">
        
        <button
          className="icon-button menu-button"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        <span className="navbar-title">{title}</span>
      </div>

      
      <div className="navbar-right">
        
        <ThemeToggle />

        
        <Link to="/app/notifications" style={{ position: "relative", display: "flex" }}>
          <button className="icon-button" aria-label="Notifications">
            <Bell size={18} />
          </button>
          
          {unreadCount > 0 && (
            <span
              className="notification-badge"
              style={{ position: "absolute", top: -4, right: -4 }}
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>

        
        <div style={{ position: "relative" }}>
          <button
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
            onClick={() => setShowUserMenu(!showUserMenu)}
            aria-label="User menu"
          >
            <Avatar user={user} />
          </button>

          
          {showUserMenu && (
            <>
              
              <div
                style={{ position: "fixed", inset: 0, zIndex: 99 }}
                onClick={() => setShowUserMenu(false)}
              />
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "calc(100% + 8px)",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                  boxShadow: "var(--shadow-lg)",
                  minWidth: 180,
                  zIndex: 100,
                  overflow: "hidden",
                }}
              >
                
                <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text)" }}>
                    {user?.name}
                  </div>
                  <div style={{ fontSize: "0.775rem", color: "var(--text-muted)" }}>
                    {user?.email}
                  </div>
                </div>

                
                <Link
                  to="/app/profile"
                  style={{ display: "block", padding: "10px 16px", color: "var(--text)", fontSize: "0.875rem" }}
                  onClick={() => setShowUserMenu(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/app/settings"
                  style={{ display: "block", padding: "10px 16px", color: "var(--text)", fontSize: "0.875rem" }}
                  onClick={() => setShowUserMenu(false)}
                >
                  Settings
                </Link>
                <button
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "10px 16px",
                    background: "none",
                    border: "none",
                    color: "#ef4444",
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    borderTop: "1px solid var(--border)",
                  }}
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
