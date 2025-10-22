import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';

const Navbar = ({ user }) => {
  const navigate = useNavigate();
  // Removed local menu state; using Bootstrap collapse for mobile

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Using Bootstrap collapse; no custom toggleMenu needed.

  return (
    <nav className="navbar navbar-expand-md navbar-light bg-white navbar-sabha">
      <div className="container">
        <Link to="/" className="navbar-brand-sabha text-decoration-none">
          <span style={{ 
            color: '#FF9933', 
            fontFamily: 'Rozha One, serif', 
            fontSize: '1.8rem',
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
          }}>Sabha</span>
          <span style={{ 
            color: '#0F4C81', 
            fontFamily: 'Rozha One, serif', 
            fontSize: '1.8rem',
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
          }}>Verse</span>
          <span style={{ 
            display: 'inline-block', 
            width: '10px', 
            height: '10px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, #FF9933, #138808, #0000CD)', 
            marginLeft: '5px' 
          }}></span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#sabhaNavbar"
          aria-controls="sabhaNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="sabhaNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-md-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/posts">Posts</Link>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Categories
              </a>
              <ul className="dropdown-menu">
                <li><Link to="/category/philosophy" className="dropdown-item">Philosophy</Link></li>
                <li><Link to="/category/ayurveda" className="dropdown-item">Ayurveda</Link></li>
                <li><Link to="/category/music" className="dropdown-item">Music</Link></li>
                <li><Link to="/category/history" className="dropdown-item">History</Link></li>
                <li><Link to="/category/yoga" className="dropdown-item">Yoga</Link></li>
                <li><Link to="/category/architecture" className="dropdown-item">Architecture</Link></li>
                <li><Link to="/category/literature" className="dropdown-item">Literature</Link></li>
                <li><Link to="/category/science" className="dropdown-item">Science</Link></li>
              </ul>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/debates">Debates</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/saved">Saved</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/liked">Liked</Link>
            </li>
          </ul>

          {user ? (
            <div className="d-flex align-items-center ms-md-auto">
              <Link to="/create-post" className="btn btn-primary me-2">New Post</Link>
              <div className="dropdown">
                <button className="profile-btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" aria-label="Profile menu">
                  <i className="bi bi-person-circle me-2"></i>
                  <span className="name">{(user?.name || user?.displayName || 'Profile')}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><Link to="/profile" className="dropdown-item">Profile</Link></li>
                  <li><Link to="/settings" className="dropdown-item">Settings</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button onClick={handleLogout} className="dropdown-item">Sign Out</button></li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="auth-links d-flex ms-md-auto mt-3 mt-md-0">
              <Link to="/login" className="btn btn-outline-primary me-2">Login</Link>
              <Link to="/signup" className="btn btn-primary">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;