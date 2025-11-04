import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login({ email, password });
      const user = response.data.user;
      if (setUser) setUser(user);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to log in. Please check your credentials.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    
    try {
      // For now, we'll just show an error since we haven't implemented Google auth in our backend
      setError('Google Sign In is not available with our custom backend yet.');
    } catch (error) {
      setError('Failed to sign in with Google.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="indian-border">
            <div className="lotus-header mb-4 text-center">
              <h2>Welcome Back to SabhaVerse</h2>
              <p className="mb-0">Login to join the discussion</p>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3 text-end">
                <Link to="/forgot-password" className="text-decoration-none" style={{ color: 'var(--peacock-blue)' }}>
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 mb-3"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>

              <div className="text-center mb-3">
                <span>OR</span>
              </div>

              <button
                type="button"
                className="btn btn-outline-secondary w-100 mb-3"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                <i className="bi bi-google me-2"></i>
                Continue with Google
              </button>

              <div className="text-center mt-4">
                <p>
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-decoration-none" style={{ color: 'var(--peacock-blue)' }}>
                    Sign Up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;