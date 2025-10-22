import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const LikedComments = () => {
  const [liked, setLiked] = useState([]);

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem('likedComments') || '[]');
      setLiked(Array.isArray(data) ? data : []);
    } catch {
      setLiked([]);
    }
  }, []);

  const removeFromSets = (item) => {
    try {
      if (item.type === 'post') {
        const key = `upvotedComments_${item.parentId}`;
        const setArr = JSON.parse(localStorage.getItem(key) || '[]');
        const nextArr = (Array.isArray(setArr) ? setArr : []).filter((id) => id !== item.commentId);
        localStorage.setItem(key, JSON.stringify(nextArr));
      } else if (item.type === 'debate') {
        const key = `upvotedDebateReplies_${item.parentId}`;
        const setArr = JSON.parse(localStorage.getItem(key) || '[]');
        const nextArr = (Array.isArray(setArr) ? setArr : []).filter((id) => String(id) !== String(item.commentId));
        localStorage.setItem(key, JSON.stringify(nextArr));
      }
    } catch (err) {
      console.warn('Failed to sync per-page upvoted set', err);
    }
  };

  const handleUnlike = (idx) => {
    try {
      const item = liked[idx];
      const next = liked.filter((_, i) => i !== idx);
      localStorage.setItem('likedComments', JSON.stringify(next));
      setLiked(next);
      if (item) removeFromSets(item);
    } catch (err) {
      console.error('Failed to unlike comment', err);
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="lotus-header">Liked Comments</h1>
        <div className="d-flex gap-2">
          <Link to="/posts" className="btn btn-outline-primary">Browse Posts</Link>
          <Link to="/debates" className="btn btn-outline-secondary">Browse Debates</Link>
        </div>
      </div>

      {liked.length === 0 ? (
        <div className="text-center py-5">
          <p className="mb-3">No liked comments yet.</p>
          <Link to="/posts" className="btn btn-primary me-2">Discover posts</Link>
          <Link to="/debates" className="btn btn-secondary">Explore debates</Link>
        </div>
      ) : (
        <div className="row g-3">
          {liked.map((item, idx) => (
            <div key={`${item.type}-${item.parentId}-${item.commentId}-${idx}`} className="col-md-6 col-lg-4">
              <div className="indian-border h-100 d-flex flex-column">
                <div className="sabha-card-body">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="badge" style={{ backgroundColor: item.type === 'post' ? 'var(--peacock-blue)' : 'var(--chakra-blue)' }}>
                      {item.type === 'post' ? 'Post' : 'Debate'}
                    </span>
                    <small className="text-muted">{new Date(item.createdAt).toLocaleDateString()}</small>
                  </div>
                  <div className="mb-2 fw-bold">{item.author}</div>
                  <p className="mb-2">{item.content}</p>
                  <div className="small text-muted mb-3">{item.parentTitle ? item.parentTitle : `${item.type} #${item.parentId}`}</div>
                </div>
                <div className="mt-auto p-3 d-flex justify-content-between align-items-center">
                  {item.type === 'post' ? (
                    <Link to={`/post/${item.parentId}`} className="btn btn-outline-primary btn-sm">Open</Link>
                  ) : (
                    <Link to={`/debate/${item.parentId}`} className="btn btn-outline-primary btn-sm">Open</Link>
                  )}
                  <button className="btn btn-outline-secondary btn-sm" onClick={() => handleUnlike(idx)}>
                    <i className="bi bi-hand-thumbs-down me-1"></i> Unlike
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

export default LikedComments;