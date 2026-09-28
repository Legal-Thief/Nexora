

import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Users, UserPlus, Trash2, Crown } from 'lucide-react';
import Avatar from '../components/Avatar.jsx';
import Modal from '../components/Modal.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getWorkspace, inviteMember, removeMember, updateMemberRole } from '../api/workspace.js';

function MembersPage() {
  const { user } = useAuth();
  const { currentWorkspace } = useOutletContext() || {};
  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState('');
  const [inviteSuccess, setInviteSuccess] = useState('');

  const loadWorkspace = async () => {
    if (!currentWorkspace) return;
    setLoading(true);
    try {
      const res = await getWorkspace(currentWorkspace._id);
      setWorkspace(res.data.workspace);
    } catch (err) {
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkspace();
  }, [currentWorkspace?._id]);

  const myRole = workspace?.members.find(
    (m) => m.user._id === user?._id || m.user._id?.toString() === user?._id?.toString()
  )?.role;
  const isOwner = myRole === 'owner';
  const isAdmin = myRole === 'admin';
  const canManage = isOwner || isAdmin;

  const handleInvite = async (e) => {
    e.preventDefault();
    setInviteError('');
    setInviteSuccess('');
    setInviteLoading(true);
    try {
      const res = await inviteMember(currentWorkspace._id, inviteEmail);
      setWorkspace(res.data.workspace);
      setInviteSuccess(`${inviteEmail} was added to the workspace.`);
      setInviteEmail('');
    } catch (err) {
      setInviteError(err.response?.data?.message || 'Failed to add member.');
    } finally {
      setInviteLoading(false);
    }
  };

  const handleRemove = async (userId) => {
    if (!window.confirm('Remove this member from the workspace?')) return;
    try {
      const res = await removeMember(currentWorkspace._id, userId);
      setWorkspace(res.data.workspace);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove member.');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await updateMemberRole(currentWorkspace._id, userId, newRole);
      setWorkspace(res.data.workspace);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update role.');
    }
  };

  if (!currentWorkspace) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon"><Users size={28} /></div>
        <h3 className="empty-state-title">No workspace selected</h3>
        <p className="empty-state-desc">Select a workspace to view members.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="page-loading"><div className="spinner" /></div>;
  }

  const members = workspace?.members || [];

  return (
    <div className="fade-in">
      
      <div className="page-header">
        <div>
          <h1 className="page-title">Members</h1>
          <p className="page-subtitle">
            {members.length} member{members.length !== 1 ? 's' : ''} in {currentWorkspace.name}
          </p>
        </div>
        {canManage && (
          <button className="primary-button" onClick={() => setShowInviteModal(true)}>
            <UserPlus size={16} /> Add Member
          </button>
        )}
      </div>

      
      <div className="card" style={{ padding: 0 }}>
        <div className="members-list">
          {members.map((member) => (
            <div key={member.user._id} className="member-item">
              <Avatar user={member.user} />
              <div className="member-info">
                <div className="member-name">
                  {member.user.name}
                  {member.user._id === user?._id && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 6 }}>
                      (you)
                    </span>
                  )}
                </div>
                <div className="member-email">{member.user.email}</div>
              </div>

              <div className="member-actions">
                
                {isOwner && member.role !== 'owner' ? (
                  <select
                    className="input"
                    style={{ padding: '4px 8px', fontSize: '0.8rem', width: 'auto' }}
                    value={member.role}
                    onChange={(e) => handleRoleChange(member.user._id, e.target.value)}
                  >
                    <option value="admin">Admin</option>
                    <option value="member">Member</option>
                  </select>
                ) : (
                  <span className={`badge badge-${member.role}`}>
                    {member.role === 'owner' && <Crown size={11} style={{ marginRight: 3 }} />}
                    {member.role}
                  </span>
                )}

                
                {canManage &&
                  member.role !== 'owner' &&
                  member.user._id !== user?._id && (
                    <button
                      className="icon-button"
                      style={{ color: '#ef4444' }}
                      onClick={() => handleRemove(member.user._id)}
                      title="Remove member"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>

      
      <Modal
        isOpen={showInviteModal}
        onClose={() => {
          setShowInviteModal(false);
          setInviteSuccess('');
          setInviteError('');
        }}
        title="Add Member"
      >
        <form onSubmit={handleInvite}>
          <div className="modal-body">
            {inviteError && <div className="error-message">{inviteError}</div>}
            {inviteSuccess && (
              <div style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                color: '#166534',
                borderRadius: 6,
                padding: '10px 14px',
                marginBottom: 12,
                fontSize: '0.85rem',
              }}>
                {inviteSuccess}
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="input"
                placeholder="colleague@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
                autoFocus
              />
              <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: 4 }}>
                The user must already have a Nexora account with this email.
              </p>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="secondary-button"
              onClick={() => setShowInviteModal(false)}
            >
              Cancel
            </button>
            <button type="submit" className="primary-button" disabled={inviteLoading}>
              {inviteLoading ? 'Adding...' : 'Add Member'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default MembersPage;
