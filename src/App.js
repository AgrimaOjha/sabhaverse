import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Layout Components
import Layout from './components/layout/Layout';

// Pages
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import SavedPosts from './pages/SavedPosts';
import LikedComments from './pages/LikedComments';

// Auth Components
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';

// Post Components
import PostDetail from './components/posts/PostDetail';
import CreatePost from './components/posts/CreatePost';

// Debate Components
import DebateDetail from './components/debates/DebateDetail';
import CreateDebate from './components/debates/CreateDebate';

// API Services
import { authService } from './services/api';

// Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/index.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await authService.getCurrentUser();
          // Backend returns the user object directly (not wrapped under `user`)
          setUser(response.data);
        } catch (error) {
          console.error('Error fetching user:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      } else {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border" role="status" style={{ color: 'var(--peacock-blue)' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Layout user={user}>
        <Routes>
          <Route path="/" element={<HomePage user={user} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/debate/:id" element={<DebateDetail />} />
          <Route path="/create-debate" element={<CreateDebate />} />
          <Route path="/create-post" element={<CreatePost user={user} />} />
          <Route path="/posts" element={<HomePage user={user} />} />
          <Route path="/debates" element={<HomePage user={user} />} />
          <Route path="/category/:category" element={<HomePage user={user} />} />
          <Route path="/categories" element={<HomePage user={user} />} />
          <Route path="/profile" element={<ProfilePage user={user} />} />
          <Route path="/settings" element={<SettingsPage user={user} setUser={setUser} />} />
          <Route path="/saved" element={<SavedPosts />} />
          <Route path="/liked" element={<LikedComments />} />
          <Route path="*" element={<HomePage user={user} />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
