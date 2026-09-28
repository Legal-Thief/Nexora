import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { BarChart2, CheckCircle, Clock, AlertTriangle, Users, Folder } from 'lucide-react';
import { getWorkspaceAnalytics } from '../api/workspace.js';

function AnalyticsPage() {
  
  const { currentWorkspace } = useOutletContext() || {};
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    if (!currentWorkspace) return;
    setLoading(true);
    getWorkspaceAnalytics(currentWorkspace._id)
      .then((res) => setAnalytics(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [currentWorkspace?._id]);

  
  if (!currentWorkspace) {
    return (
      <div className="empty-state">
        <h3 className="empty-state-title">No workspace selected</h3>
      </div>
    );
  }

  if (loading) return <div className="page-loading"><div className="spinner" /></div>;

  
  if (!analytics) return null;

  
  const statusLabels = { todo: 'To Do', in_progress: 'In Progress', review: 'Review', done: 'Done' };
  const priorityLabels = { low: 'Low', medium: 'Medium', high: 'High', urgent: 'Urgent' };

  
  const statusColors = { todo: 'color-todo', in_progress: 'color-in-progress', review: 'color-review', done: 'color-done' };
  const priorityColors = { low: 'color-low', medium: 'color-medium', high: 'color-high', urgent: 'color-urgent' };

  return (
    <div className="analytics-page fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">{currentWorkspace.name} overview</p>
        </div>
      </div>

      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-icon" style={{ backgroundColor: '#eef2ff' }}>
            <Folder size={22} color="#6366f1" />
          </div>
          <div>
            <div className="stat-card-value">{analytics.totalProjects}</div>
            <div className="stat-card-label">Total Projects</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ backgroundColor: '#eff6ff' }}>
            <BarChart2 size={22} color="#3b82f6" />
          </div>
          <div>
            <div className="stat-card-value">{analytics.totalTasks}</div>
            <div className="stat-card-label">Total Tasks</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ backgroundColor: '#f0fdf4' }}>
            <CheckCircle size={22} color="#10b981" />
          </div>
          <div>
            <div className="stat-card-value">{analytics.completionPercent}%</div>
            <div className="stat-card-label">Completion Rate</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ backgroundColor: '#fef2f2' }}>
            <AlertTriangle size={22} color="#ef4444" />
          </div>
          <div>
            <div className="stat-card-value">{analytics.overdueTasks}</div>
            <div className="stat-card-label">Overdue Tasks</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ backgroundColor: '#fff7ed' }}>
            <Users size={22} color="#f59e0b" />
          </div>
          <div>
            <div className="stat-card-value">{analytics.memberCount}</div>
            <div className="stat-card-label">Team Members</div>
          </div>
        </div>
      </div>

      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        
        <div className="card">
          <h2 className="section-title">Tasks by Status</h2>
          {Object.entries(analytics.tasksByStatus || {}).map(([status, count]) => {
            const percent = analytics.totalTasks > 0
              ? Math.round((count / analytics.totalTasks) * 100)
              : 0;
            return (
              <div key={status} className="progress-bar-container">
                <div className="progress-bar-label">
                  <span>{statusLabels[status] || status}</span>
                  <span>{count} ({percent}%)</span>
                </div>
                <div className="progress-bar-track">
                  <div
                    className={`progress-bar-fill ${statusColors[status] || 'color-primary'}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        
        <div className="card">
          <h2 className="section-title">Tasks by Priority</h2>
          {Object.entries(analytics.tasksByPriority || {}).map(([priority, count]) => {
            const percent = analytics.totalTasks > 0
              ? Math.round((count / analytics.totalTasks) * 100)
              : 0;
            return (
              <div key={priority} className="progress-bar-container">
                <div className="progress-bar-label">
                  <span>{priorityLabels[priority] || priority}</span>
                  <span>{count} ({percent}%)</span>
                </div>
                <div className="progress-bar-track">
                  <div
                    className={`progress-bar-fill ${priorityColors[priority] || 'color-primary'}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      
      <div className="card">
        <h2 className="section-title">Overall Progress</h2>
        <div className="progress-bar-container">
          <div className="progress-bar-label">
            <span>Completion</span>
            <span>{analytics.completedTasks} of {analytics.totalTasks} tasks done</span>
          </div>
          <div className="progress-bar-track" style={{ height: 16 }}>
            <div
              className="progress-bar-fill color-done"
              style={{ width: `${analytics.completionPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;
