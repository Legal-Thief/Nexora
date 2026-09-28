import { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Folder, CheckSquare, CheckCircle, Users, TrendingUp, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { getProjects } from '../api/project.js';
import { getWorkspaceAnalytics } from '../api/workspace.js';

function DashboardPage() {
  const { user } = useAuth();
  const { currentWorkspace } = useOutletContext() || {};

  const [projects, setProjects] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    if (!currentWorkspace) return;
    setLoading(true);

    Promise.all([
      getProjects(currentWorkspace._id),
      getWorkspaceAnalytics(currentWorkspace._id),
    ])
      .then(([projectsRes, analyticsRes]) => {
        setProjects(projectsRes.data.projects || []);
        setAnalytics(analyticsRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [currentWorkspace?._id]);

  
  if (!currentWorkspace) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon"><Folder size={28} /></div>
        <h3 className="empty-state-title">No workspace selected</h3>
        <p className="empty-state-desc">Create a workspace to get started.</p>
        <Link to="/workspace/new" className="primary-button">Create Workspace</Link>
      </div>
    );
  }

  
  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner" />
      </div>
    );
  }

  
  const recentProjects = projects.slice(0, 4);

  return (
    <div className="dashboard fade-in">

      
      <div className="page-header">
        <div>
          <h1 className="page-title">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="page-subtitle">{currentWorkspace.name} workspace</p>
        </div>
        <Link to="/app/projects" className="primary-button">
          <Plus size={16} />
          New Project
        </Link>
      </div>

      
      <div className="stats-grid">

        
        <div className="stat-card">
          <div className="stat-card-icon" style={{ backgroundColor: '#eef2ff' }}>
            <Folder size={22} color="#6366f1" />
          </div>
          <div>
            <div className="stat-card-value">{analytics?.totalProjects || 0}</div>
            <div className="stat-card-label">Total Projects</div>
          </div>
        </div>

        
        <div className="stat-card">
          <div className="stat-card-icon" style={{ backgroundColor: '#eff6ff' }}>
            <CheckSquare size={22} color="#3b82f6" />
          </div>
          <div>
            <div className="stat-card-value">{analytics?.totalTasks || 0}</div>
            <div className="stat-card-label">Total Tasks</div>
          </div>
        </div>

        
        <div className="stat-card">
          <div className="stat-card-icon" style={{ backgroundColor: '#f0fdf4' }}>
            <CheckCircle size={22} color="#10b981" />
          </div>
          <div>
            <div className="stat-card-value">{analytics?.completedTasks || 0}</div>
            <div className="stat-card-label">Completed</div>
          </div>
        </div>

        
        <div className="stat-card">
          <div className="stat-card-icon" style={{ backgroundColor: '#fff7ed' }}>
            <Users size={22} color="#f59e0b" />
          </div>
          <div>
            <div className="stat-card-value">{analytics?.memberCount || 0}</div>
            <div className="stat-card-label">Team Members</div>
          </div>
        </div>

      </div>

      
      <div className="card">
        <div className="flex-between" style={{ marginBottom: 16 }}>
          <h2 className="section-title" style={{ margin: 0 }}>Recent Projects</h2>
          <Link to="/app/projects" style={{ fontSize: '0.85rem', color: 'var(--primary)' }}>
            View all
          </Link>
        </div>

        {recentProjects.length === 0 ? (
          <div className="empty-state" style={{ padding: '32px 0' }}>
            <div className="empty-state-icon"><Folder size={24} /></div>
            <p className="empty-state-title">No projects yet</p>
            <p className="empty-state-desc">Create your first project to get started.</p>
          </div>
        ) : (
          <div className="recent-list">
            {recentProjects.map((project) => (
              <Link
                key={project._id}
                to={`/app/projects/${project._id}`}
                className="recent-item"
                style={{ textDecoration: 'none' }}
              >
                
                <div
                  style={{
                    width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Folder size={16} color="white" />
                </div>

                
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)' }}>
                    {project.title}
                  </div>
                  <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                    {project.taskCount || 0} tasks · {project.status}
                  </div>
                </div>

                
                <span
                  className={`badge badge-${project.status === 'in_progress' ? 'in-progress' : project.status}`}
                >
                  {project.status}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      
      {analytics && analytics.totalTasks > 0 && (
        <div className="card">
          <h2 className="section-title">Task Progress</h2>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {Object.entries(analytics.tasksByStatus || {}).map(([status, count]) => {
              const percent = analytics.totalTasks > 0
                ? Math.round((count / analytics.totalTasks) * 100)
                : 0;
              const labels = {
                todo: 'To Do',
                in_progress: 'In Progress',
                review: 'Review',
                done: 'Done',
              };
              return (
                <div key={status} style={{ flex: '1 1 200px' }}>
                  <div className="progress-bar-container">
                    <div className="progress-bar-label">
                      <span>{labels[status] || status}</span>
                      <span>{count} ({percent}%)</span>
                    </div>
                    <div className="progress-bar-track">
                      <div
                        className={`progress-bar-fill color-${status.replace('_', '-')}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}

export default DashboardPage;
