import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from 'firebase/auth';
import { auth } from '../firebase';

const SettingsPage = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState(user?.displayName || user?.name || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user) {
      const t = setTimeout(() => navigate('/login'), 100);
      return () => clearTimeout(t);
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName });
        const updatedUser = { ...user, displayName };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        if (setUser) setUser(updatedUser);
        setSuccess('Profile updated successfully');
      } else {
        setError('You are not authenticated.');
      }
    } catch (err) {
      console.error(err);
      setError(err?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="indian-border">
            <div className="lotus-header mb-4">
              <h2 className="mb-0">Account Settings</h2>
            </div>
            <form onSubmit={handleSave}>
              <div className="mb-3">
                <label className="form-label">Display Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your public display name"
                  required
                />
              </div>

              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              <div className="d-flex justify-content-between align-items-center">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" className="btn btn-outline-secondary" onClick={() => navigate(-1)} disabled={loading}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;