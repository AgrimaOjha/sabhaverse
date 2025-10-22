import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const SavedPosts = () => {
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem('savedPosts') || '[]');
      setSaved(Array.isArray(data) ? data : []);
    } catch {
      setSaved([]);
    }
  }, []);

  const handleRemove = (id) => {
    try {
      const next = saved.filter(p => p.id !== id);
      localStorage.setItem('savedPosts', JSON.stringify(next));
      setSaved(next);
    } catch (err) {
      console.error('Failed to remove saved post', err);
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="lotus-header">Saved Posts</h1>
        <Link to="/posts" className="btn btn-outline-primary">Browse Posts</Link>
      </div>

      {saved.length === 0 ? (
        <div className="text-center py-5">
          <p className="mb-3">No saved posts yet.</p>
          <Link to="/posts" className="btn btn-primary">Discover posts</Link>
        </div>
      ) : (
        <div className="row g-3">
          {saved.map(post => (
            <div key={post.id} className="col-md-6 col-lg-4">
              <div className="indian-border h-100 d-flex flex-column">
                <div className="sabha-card-body">
                  <Link to={`/post/${post.id}`} className="text-decoration-none">
                    <h5 className="mb-2" style={{ color: 'var(--peacock-blue)' }}>{post.title}</h5>
                  </Link>
                  <div className="small text-muted">{post.category} • {new Date(post.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="mt-auto p-3 d-flex justify-content-between align-items-center">
                  <Link to={`/post/${post.id}`} className="btn btn-outline-primary btn-sm">Open</Link>
                  <button className="btn btn-outline-secondary btn-sm" onClick={() => handleRemove(post.id)}>
                    <i className="bi bi-bookmark-x me-1"></i> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPosts;