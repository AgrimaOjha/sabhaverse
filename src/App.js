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

// API Services
import { authService } from './services/api';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

// Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/index.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const u = {
          uid: fbUser.uid,
          displayName: fbUser.displayName || fbUser.email,
          email: fbUser.email,
          photoURL: fbUser.photoURL || null,
        };
        setUser(u);
        localStorage.setItem('user', JSON.stringify(u));
        setLoading(false);
      } else {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const response = await authService.getCurrentUser();
            setUser(response.data);
          } catch (error) {
            console.error('Error fetching user:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    });

    return () => unsubscribe();
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
