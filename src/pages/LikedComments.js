import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const LikedComments = () => {
  const [liked, setLiked] = useState([]);
  // Add liked posts section (based on upvoted posts)
  const [likedPosts, setLikedPosts] = useState([]);
  const [upvotedIds, setUpvotedIds] = useState([]);

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem('likedComments') || '[]');
      setLiked(Array.isArray(data) ? data : []);
    } catch {
      setLiked([]);
    }
  }, []);

  // Load liked posts from localStorage 'upvotedPosts' and map to post objects
  useEffect(() => {
    try {
      const ids = JSON.parse(localStorage.getItem('upvotedPosts') || '[]');
      const userPosts = JSON.parse(localStorage.getItem('userPosts') || '[]');
      const defaultPosts = [
        {
          id: 1,
          title: 'The Philosophy of Advaita Vedanta',
          excerpt: 'Exploring the non-dualistic approach to reality and consciousness...',
          author: 'Adi Shankar',
          category: 'Philosophy',
          upvotes: 42,
          commentCount: 15,
          createdAt: '2023-06-15'
        },
        {
          id: 2,
          title: 'Ayurvedic Remedies for Modern Lifestyle',
          excerpt: 'Ancient Ayurvedic practices for modern living...',
          author: 'Charaka',
          category: 'Ayurveda',
          upvotes: 38,
          commentCount: 12,
          createdAt: '2023-06-12'
        },
        {
          id: 3,
          title: 'Vedic Mathematics Techniques Explained',
          excerpt: 'Rapid calculations using Vedic methods...',
          author: 'Bhaskaracharya',
          category: 'Science',
          upvotes: 50,
          commentCount: 20,
          createdAt: '2023-06-08'
        }
      ];
      const allPosts = [...defaultPosts, ...userPosts];
      const likedList = (Array.isArray(ids) ? ids : [])
        .map((pid) => allPosts.find((p) => String(p.id) === String(pid)))
        .filter(Boolean);
      setUpvotedIds(Array.isArray(ids) ? ids : []);
      setLikedPosts(likedList);
    } catch {
      setUpvotedIds([]);
      setLikedPosts([]);
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

  // Unlike a liked post (remove from 'upvotedPosts' and state)
  const handleUnlikePost = (postId) => {
    try {
      const ids = JSON.parse(localStorage.getItem('upvotedPosts') || '[]');
      const nextIds = (Array.isArray(ids) ? ids : []).filter((id) => String(id) !== String(postId));
      localStorage.setItem('upvotedPosts', JSON.stringify(nextIds));
      setUpvotedIds(nextIds);
      setLikedPosts((prev) => prev.filter((p) => String(p.id) !== String(postId)));
    } catch (err) {
      console.error('Failed to unlike post', err);
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="lotus-header">Likes</h1>
        <div className="d-flex gap-2">
          <Link to="/posts" className="btn btn-outline-primary">Browse Posts</Link>
          <Link to="/debates" className="btn btn-outline-secondary">Browse Debates</Link>
        </div>
      </div>

      {/* Liked Posts */}
      <div className="mb-5">
        <h2 className="mb-3" style={{ color: 'var(--peacock-blue)' }}>Liked Posts</h2>
        {likedPosts.length === 0 ? (
          <div className="text-muted">No liked posts yet. Upvote a post to like it.</div>
        ) : (
          <div className="row g-3">
            {likedPosts.map((post) => (
              <div key={post.id} className="col-md-6 col-lg-4">
                <div className="sabha-card h-100">
                  <div className="sabha-card-header d-flex justify-content-between align-items-center">
                    <span className="badge" style={{ backgroundColor: 'var(--saffron)' }}>{post.category || 'General'}</span>
                    <small>{new Date(post.createdAt).toLocaleDateString()}</small>
                  </div>
                  <div className="sabha-card-body">
                    <h5 className="card-title mb-2">
                      <Link to={`/post/${post.id}`} className="text-decoration-none" style={{ color: 'var(--peacock-blue)' }}>
                        {post.title}
                      </Link>
                    </h5>
                    {post.excerpt && <p className="card-text text-muted">{post.excerpt}</p>}
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div>
                        <span className="me-3">
                          <i className="bi bi-hand-thumbs-up me-1"></i> {post.upvotes || 0}
                        </span>
                        <span>
                          <i className="bi bi-chat-dots me-1"></i> {post.commentCount || 0}
                        </span>
                      </div>
                      <small className="text-muted">By {post.author || 'Anonymous'}</small>
                    </div>
                  </div>
                  <div className="p-3 d-flex justify-content-between align-items-center">
                    <Link to={`/post/${post.id}`} className="btn btn-outline-primary btn-sm">Open</Link>
                    <button className="btn btn-outline-secondary btn-sm" onClick={() => handleUnlikePost(post.id)}>
                      <i className="bi bi-hand-thumbs-down me-1"></i> Unlike
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Liked Comments */}
      <div>
        <h2 className="mb-3" style={{ color: 'var(--peacock-blue)' }}>Liked Comments</h2>
        {liked.length === 0 ? (
          <div className="text-center py-4">
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
    </div>
  );
};

export default LikedComments;