import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postService } from '../../services/api';

const CreatePost = ({ user }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('philosophy');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    if (!user) {

      const t = setTimeout(() => navigate('/login'), 100);
      return () => clearTimeout(t);
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title.trim() || !content.trim()) {
      return setError('Title and content are required');
    }

    setLoading(true);
    try {

      const token = localStorage.getItem('token');
      

      const newPost = {
        id: Date.now(), 
        title,
        excerpt: content.substring(0, 120) + '...',
        content,
        category,
        author: user?.name || 'Anonymous User',
        upvotes: 0,
        commentCount: 0,
        createdAt: new Date().toISOString()
      };
      

      const savedPosts = JSON.parse(localStorage.getItem('userPosts') || '[]');
      savedPosts.push(newPost);
      localStorage.setItem('userPosts', JSON.stringify(savedPosts));
      
      if (token) {
        try {
          const res = await postService.createPost({ title, category, content });
          setSuccess('Post created successfully');
        
          if (res?.data?.id) {
            navigate(`/post/${res.data.id}`);
          } else {
         
            setTimeout(() => navigate('/posts'), 800);
          }
        } catch (error) {
          console.log('API error, but post saved locally:', error);
          setSuccess('Post saved locally. Backend sync failed.');
          setTimeout(() => navigate('/posts'), 800);
        }
      } else {

        setSuccess('Post created successfully (local only).');
        setTimeout(() => navigate('/posts'), 800);
      }
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="indian-border p-4">
            <h2 className="lotus-header mb-3">Create New Post</h2>
            <p className="text-muted mb-4">Share your thoughts with the community.</p>

            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            {success && <div className="alert alert-success" role="alert">{success}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a clear, descriptive title"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="philosophy">Philosophy</option>
                  <option value="ayurveda">Ayurveda</option>
                  <option value="music">Music</option>
                  <option value="history">History</option>
                  <option value="yoga">Yoga</option>
                  <option value="architecture">Architecture</option>
                  <option value="literature">Literature</option>
                  <option value="science">Science</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Content</label>
                <textarea
                  className="form-control"
                  rows="8"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your post here..."
                  required
                ></textarea>
              </div>

              <div className="d-flex justify-content-between align-items-center">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Publishing...' : 'Publish'}
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

export default CreatePost;