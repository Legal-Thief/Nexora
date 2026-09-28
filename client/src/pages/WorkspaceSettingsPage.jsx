

import { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Trash2, Link2, Copy } from 'lucide-react';
import Modal from '../components/Modal.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import {
  updateWorkspace,
  deleteWorkspace,
  createInvitation,
  getInvitations,
  cancelInvitation,
} from '../api/workspace.js';

function WorkspaceSettingsPage() {
  const { user } = useAuth();
  const { currentWorkspace } = useOutletContext() || {};
  const navigate = useNavigate();

  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState('');
  const [updateError, setUpdateError] = useState('');

  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  
  const [invitations, setInvitations] = useState([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!currentWorkspace) return;
    setName(currentWorkspace.name);
    setDescription(currentWorkspace.description || '');
    loadInvitations();
  }, [currentWorkspace?._id]);

  const loadInvitations = async () => {
    try {
      const res = await getInvitations(currentWorkspace._id);
      setInvitations(res.data.invitations || []);
    } catch (err) {
      
    }
  };

  
  const myRole = currentWorkspace?.members?.find(
    (m) => (m.user._id || m.user) === user?._id ||
            (m.user._id || m.user)?.toString() === user?._id?.toString()
  )?.role;
  const isOwner = myRole === 'owner';
  const isAdmin = myRole === 'admin';
  const canManage = isOwner || isAdmin;

  
  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateError('');
    setUpdateSuccess('');
    setUpdateLoading(true);
    try {
      await updateWorkspace(currentWorkspace._id, { name, description });
      setUpdateSuccess('Workspace updated successfully!');
    } catch (err) {
      setUpdateError(err.response?.data?.message || 'Failed to update workspace.');
    } finally {
      setUpdateLoading(false);
    }
  };

  
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteWorkspace(currentWorkspace._id);
      localStorage.removeItem('currentWorkspaceId');
      navigate('/workspace/new');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete workspace.');
      setDeleteLoading(false);
    }
  };

  
  const handleCreateInvitation = async (e) => {
    e.preventDefault();
    setInviteLoading(true);
    setInviteLink('');
    try {
      const res = await createInvitation(currentWorkspace._id, inviteEmail, inviteRole);
      
      const link = `${window.location.origin}/invite/${res.data.invitation.token}`;
      setInviteLink(link);
      setInvitations((prev) => [res.data.invitation, ...prev]);
      setInviteEmail('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create invitation.');
    } finally {
      setInviteLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCancelInvitation = async (invId) => {
    try {
      await cancelInvitation(currentWorkspace._id, invId);
      setInvitations((prev) => prev.filter((inv) => inv._id !== invId));
    } catch (err) {
      alert('Failed to cancel invitation.');
    }
  };

  if (!currentWorkspace) {
    return (
      <div className="empty-state">
        <h3 className="empty-state-title">No workspace selected</h3>
        <p className="empty-state-desc">Select a workspace from the sidebar.</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Workspace Settings</h1>
      </div>

      
      <div className="card" style={{ marginBottom: 20 }}>
        <h2 className="section-title">General</h2>

        {updateSuccess && (
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            color: '#166534',
            borderRadius: 6,
            padding: '10px 14px',
            marginBottom: 16,
            fontSize: '0.875rem',
          }}>
            {updateSuccess}
          </div>
        )}
        {updateError && <div className="error-message">{updateError}</div>}

        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label className="form-label">Workspace Name</label>
            <input
              type="text"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={50}
              disabled={!canManage}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              disabled={!canManage}
            />
          </div>
          {canManage && (
            <button type="submit" className="primary-button" disabled={updateLoading}>
              {updateLoading ? 'Saving...' : 'Save Changes'}
            </button>
          )}
        </form>
      </div>

      
      {canManage && (
        <div className="card" style={{ marginBottom: 20 }}>
          <h2 className="section-title">
            <Link2 size={16} style={{ marginRight: 6, display: 'inline' }} />
            Invite via Link
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 16 }}>
            Generate an invitation link and share it. The person must have a Nexora account
            with the same email address.
          </p>

          <form
            onSubmit={handleCreateInvitation}
            style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}
          >
            <input
              type="email"
              className="input"
              placeholder="Email address"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              required
              style={{ flex: 2, minWidth: 200 }}
            />
            <select
              className="input"
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              style={{ flex: 1, minWidth: 100 }}
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit" className="primary-button" disabled={inviteLoading}>
              {inviteLoading ? 'Generating...' : 'Generate Link'}
            </button>
          </form>

          
          {inviteLink && (
            <div style={{
              background: 'var(--primary-light)',
              border: '1px solid rgba(99,102,241,0.3)',
              borderRadius: 6,
              padding: '12px 14px',
              marginBottom: 16,
            }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, marginBottom: 6 }}>
                ✓ Invite link generated! Share this with your team member:
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <code style={{
                  fontSize: '0.775rem',
                  flex: 1,
                  wordBreak: 'break-all',
                  color: 'var(--text)',
                  background: 'var(--bg)',
                  padding: '6px 8px',
                  borderRadius: 4,
                  border: '1px solid var(--border)',
                }}>
                  {inviteLink}
                </code>
                <button
                  className="secondary-button"
                  style={{ padding: '6px 12px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                  onClick={handleCopyLink}
                >
                  <Copy size={13} style={{ marginRight: 4 }} />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          )}

          
          {invitations.length > 0 && (
            <div>
              <div style={{
                fontSize: '0.825rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                marginBottom: 8,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                Pending Invitations
              </div>
              {invitations.map((inv) => (
                <div
                  key={inv._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 0',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text)' }}>{inv.email}</span>
                    <span className={`badge badge-${inv.role}`} style={{ marginLeft: 8 }}>{inv.role}</span>
                    <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginLeft: 8 }}>
                      · expires {new Date(inv.expiresAt).toLocaleDateString()}
                    </span>
                  </div>
                  <button
                    className="icon-button"
                    style={{ color: '#ef4444' }}
                    onClick={() => handleCancelInvitation(inv._id)}
                    title="Cancel invitation"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      
      {isOwner && (
        <div className="card" style={{ borderColor: '#fee2e2' }}>
          <h2 className="section-title" style={{ color: '#ef4444' }}>Danger Zone</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: 14, lineHeight: 1.6 }}>
            Deleting this workspace will permanently remove all its projects, tasks, comments, and data.
            This action <strong>cannot be undone</strong>.
          </p>
          <button className="danger-button" onClick={() => setShowDeleteModal(true)}>
            <Trash2 size={16} /> Delete Workspace
          </button>
        </div>
      )}

      
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Workspace"
      >
        <div className="modal-body">
          <p style={{ color: 'var(--text)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Are you sure you want to delete <strong>"{currentWorkspace.name}"</strong>?<br /><br />
            All projects and tasks inside it will be permanently deleted.
          </p>
        </div>
        <div className="modal-footer">
          <button className="secondary-button" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </button>
          <button className="danger-button" onClick={handleDelete} disabled={deleteLoading}>
            {deleteLoading ? 'Deleting...' : 'Yes, Delete It'}
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default WorkspaceSettingsPage;
