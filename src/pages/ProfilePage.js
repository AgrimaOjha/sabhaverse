import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const ProfilePage = ({ user }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      const t = setTimeout(() => navigate('/login'), 100);
      return () => clearTimeout(t);
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const name = user?.name || user?.displayName || 'Anonymous';
  const email = user?.email || 'No email';

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="indian-border">
            <div className="lotus-header mb-4">
              <h2 className="mb-0">Your Profile</h2>
            </div>
            <div className="d-flex align-items-center mb-4">
              <div className="me-3" style={{ fontSize: '2rem', color: 'var(--peacock-blue)' }}>
                <i className="bi bi-person-circle"></i>
              </div>
              <div>
                <h4 className="mb-1" style={{ color: 'var(--peacock-blue)' }}>{name}</h4>
                <div className="text-muted">{email}</div>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-muted">Manage your account details and personalize your presence on SabhaVerse.</p>
            </div>

            <div className="d-flex gap-2">
              <Link to="/settings" className="btn btn-primary">Go to Settings</Link>
              <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>Back</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;