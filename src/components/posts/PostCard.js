import React from 'react';
import { Link } from 'react-router-dom';

// Map categories to colors
const categoryColors = {
  'philosophy': 'var(--rangoli-purple)',
  'ayurveda': 'var(--mehendi-green)',
  'music': 'var(--spice-orange)',
  'history': 'var(--henna-brown)',
  'yoga': 'var(--banyan-green)',
  'architecture': 'var(--kolam-blue)',
  'literature': 'var(--jaipur-pink)',
  'science': 'var(--madhubani-teal)',
  'default': 'var(--peacock-blue)'
};

const PostCard = ({ post }) => {
  const categoryColor = categoryColors[post.category.toLowerCase()] || categoryColors.default;
  
  return (
    <div className="sabha-card h-100">
      <div className="sabha-card-header d-flex justify-content-between align-items-center" 
           style={{ background: categoryColor }}>
        <span className="badge" style={{ 
          backgroundColor: 'rgba(255,255,255,0.2)', 
          color: 'white',
          fontWeight: 'bold'
        }}>{post.category}</span>
        <small style={{ color: 'white' }}>{new Date(post.createdAt).toLocaleDateString()}</small>
      </div>
      <div className="sabha-card-body">
        <h5 className="card-title mb-3">
          <Link to={`/post/${post.id}`} className="text-decoration-none" style={{ color: categoryColor }}>
            {post.title}
          </Link>
        </h5>
        <p className="card-text text-muted">{post.excerpt}</p>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div>
            <span className="me-3" style={{ color: 'var(--gulmohar-red)' }}>
              <i className="bi bi-hand-thumbs-up me-1"></i> {post.upvotes}
            </span>
            <span style={{ color: 'var(--kolam-blue)' }}>
              <i className="bi bi-chat-dots me-1"></i> {post.commentCount}
            </span>
          </div>
          <small style={{ 
            color: categoryColor, 
            fontWeight: 'bold',
            background: 'rgba(255,255,255,0.1)',
            padding: '2px 8px',
            borderRadius: '12px'
          }}>By {post.author}</small>
        </div>
      </div>
    </div>
  );
};

export default PostCard;