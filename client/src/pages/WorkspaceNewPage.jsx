

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createWorkspace } from '../api/workspace.js';
import { useAuth } from '../context/AuthContext.jsx';

function WorkspaceNewPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await createWorkspace(name, description);
      const workspaceId = res.data.workspace._id;
      
      localStorage.setItem('currentWorkspaceId', workspaceId);
      navigate('/app/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create workspace.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 480 }}>
        <div className="auth-logo">Nexora<span>.</span></div>
        <p className="auth-subtitle">Create your first workspace</p>
        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginBottom: 24 }}>
          A workspace is where you and your team manage projects and tasks.
        </p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Workspace Name</label>
            <input
              type="text"
              className="input"
              placeholder="e.g. My Startup, CS Project, Team Alpha"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
              maxLength={50}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description (optional)</label>
            <input
              type="text"
              className="input"
              placeholder="What is this workspace for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={200}
            />
          </div>

          <button
            type="submit"
            className="primary-button"
            style={{ width: '100%' }}
            disabled={loading || !name.trim()}
          >
            {loading ? 'Creating...' : 'Create Workspace'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default WorkspaceNewPage;
