

import { useState } from 'react';
import Avatar from '../components/Avatar.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await updateProfile({ name, avatar });
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Profile</h1>
      </div>

      <div className="card" style={{ maxWidth: 480 }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <Avatar user={{ name, avatar }} size="xl" />
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)' }}>
              {name || user?.name}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              {user?.email}
            </div>
          </div>
        </div>

        {success && (
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            color: '#166534',
            borderRadius: 6,
            padding: '10px 14px',
            marginBottom: 16,
            fontSize: '0.875rem',
          }}>
            {success}
          </div>
        )}
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={50}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Avatar URL (optional)</label>
            <input
              type="url"
              className="input"
              placeholder="https://example.com/your-photo.jpg"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
            />
            <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: 4 }}>
              Paste a direct URL to any image. Leave empty to use initials as avatar.
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="input"
              value={user?.email || ''}
              disabled
              style={{ opacity: 0.6, cursor: 'not-allowed' }}
            />
            <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: 4 }}>
              Email address cannot be changed.
            </p>
          </div>

          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;
