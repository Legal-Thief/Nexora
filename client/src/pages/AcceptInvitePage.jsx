

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getInvitationByToken, acceptInvitation } from '../api/notification.js';
import { useAuth } from '../context/AuthContext.jsx';

function AcceptInvitePage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState('');

  
  useEffect(() => {
    getInvitationByToken(token)
      .then((res) => setInvitation(res.data.invitation))
      .catch((err) =>
        setError(err.response?.data?.message || 'This invitation link is invalid or has expired.')
      )
      .finally(() => setLoading(false));
  }, [token]);

  const handleAccept = async () => {
    if (!user) {
      
      navigate(`/login?redirect=/invite/${token}`);
      return;
    }

    setAccepting(true);
    try {
      const res = await acceptInvitation(token);
      
      localStorage.setItem('currentWorkspaceId', res.data.workspace._id);
      navigate('/app/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to accept invitation.');
      setAccepting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">Nexora<span>.</span></div>

        {loading ? (
          
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div className="spinner" style={{ margin: '0 auto' }} />
            <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 12, fontSize: '0.875rem' }}>
              Loading invitation...
            </p>
          </div>
        ) : error ? (
          
          <div>
            <div className="auth-error">{error}</div>
            <Link
              to="/"
              className="secondary-button"
              style={{
                width: '100%',
                marginTop: 12,
                display: 'flex',
                justifyContent: 'center',
                color: 'rgba(255,255,255,0.7)',
                borderColor: 'rgba(255,255,255,0.2)',
              }}
            >
              Go to Home
            </Link>
          </div>
        ) : (
          
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 6, fontSize: '0.9rem' }}>
              You've been invited to join
            </p>
            <h2 style={{ color: 'white', fontWeight: 800, fontSize: '1.4rem', marginBottom: 6 }}>
              {invitation?.workspace?.name}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.825rem', marginBottom: 28 }}>
              Invited by <strong style={{ color: 'rgba(255,255,255,0.7)' }}>{invitation?.invitedBy?.name}</strong>
              {' · '}as <span className={`badge badge-${invitation?.role}`}>{invitation?.role}</span>
            </p>

            {!user ? (
              /* Not logged in */
              <div>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem', marginBottom: 20, lineHeight: 1.6 }}>
                  Please log in or create an account to accept this invitation.
                  <br />
                  <strong style={{ color: 'rgba(255,255,255,0.7)' }}>
                    Make sure to use the email address: {invitation?.email}
                  </strong>
                </p>
                <Link to="/login">
                  <button className="primary-button" style={{ width: '100%', marginBottom: 10 }}>
                    Log In
                  </button>
                </Link>
                <Link to="/register">
                  <button
                    className="secondary-button"
                    style={{
                      width: '100%',
                      color: 'rgba(255,255,255,0.7)',
                      borderColor: 'rgba(255,255,255,0.2)',
                      background: 'transparent',
                    }}
                  >
                    Create Account
                  </button>
                </Link>
              </div>
            ) : (
              /* Logged in — show accept button */
              <div>
                <p style={{ fontSize: '0.825rem', color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>
                  Logged in as <strong style={{ color: 'rgba(255,255,255,0.7)' }}>{user.email}</strong>
                </p>
                <button
                  className="primary-button"
                  style={{ width: '100%' }}
                  onClick={handleAccept}
                  disabled={accepting}
                >
                  {accepting ? 'Joining workspace...' : '✓ Accept Invitation'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AcceptInvitePage;
