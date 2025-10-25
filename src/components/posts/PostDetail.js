import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { postService, commentService } from '../../services/api';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const postId = parseInt(id) || 1;
  
  // Default post data as fallback
  const defaultPost = {
    id: postId,
    title: 'The Philosophy of Advaita Vedanta',
    content: `
      <p>Advaita Vedanta is one of the most influential sub-schools of Vedanta, an ancient Indian philosophy that emphasizes the unity of the individual soul (Atman) with the ultimate reality (Brahman).</p>
      
      <p>The word "Advaita" means "non-dual" or "not two," emphasizing the idea that the true self (Atman) and the ultimate reality (Brahman) are one and the same. This philosophy was systematized by the 8th-century philosopher Adi Shankaracharya.</p>
      
      <h3>Key Concepts in Advaita Vedanta</h3>
      
      <p>Advaita Vedanta is based on several key concepts:</p>
      
      <ul>
        <li><strong>Brahman</strong>: The ultimate, unchanging reality that is the source and ground of all existence.</li>
        <li><strong>Atman</strong>: The individual self or soul, which is identical to Brahman.</li>
        <li><strong>Maya</strong>: The illusory nature of the world, which appears distinct from Brahman due to ignorance (avidya).</li>
        <li><strong>Moksha</strong>: Liberation from the cycle of rebirth, achieved through the realization of the unity of Atman and Brahman.</li>
      </ul>
    `,
    author: {
      id: 1,
      name: 'Adi Shankar',
      avatar: 'https://placehold.co/100',
      reputation: 1250
    },
    category: 'Philosophy',
    upvotes: 42,
    createdAt: '2023-06-15',
    comments: [
      {
        id: 1,
        content: "This is a fascinating exploration of Advaita Vedanta. I particularly appreciate the clarity with which you've explained the concept of Maya.",
        author: 'Vivekananda',
        createdAt: '2023-06-16',
        upvotes: 12
      },
      {
        id: 2,
        content: 'How would you compare Advaita Vedanta with Dvaita (dualistic) philosophy? They seem to have fundamentally different perspectives on the relationship between Atman and Brahman.',
        author: 'Madhvacharya',
        createdAt: '2023-06-17',
        upvotes: 8
      }
    ]
  };

  // Normalize any post to ensure required fields exist
  const normalizePost = (p) => ({
    ...defaultPost,
    ...(p || {}),
    author: (p && p.author) ? p.author : defaultPost.author,
    category: (p && p.category) ? p.category : defaultPost.category,
    createdAt: (p && p.createdAt) ? p.createdAt : defaultPost.createdAt,
    upvotes: typeof (p && p.upvotes) === 'number' ? p.upvotes : 0,
    comments: Array.isArray(p && p.comments) ? p.comments : [],
    content: (p && p.content) ? p.content : defaultPost.content,
    title: (p && p.title) ? p.title : defaultPost.title,
  });
  
  // Find the specific post from localStorage or use default
  const findPostById = (id) => {
    try {
      // Try to find in user created posts
      const userPosts = JSON.parse(localStorage.getItem('userPosts') || '[]');
      const userPost = userPosts.find(p => p.id === id || p.id === postId);
      if (userPost) return normalizePost(userPost);
      
      // If not found, check default posts from HomePage
      const defaultPosts = [
        defaultPost,
        {
          id: 2,
          title: 'Understanding Dharma in Modern Context',
          content: '<p>Exploring dharma today...</p>',
          author: defaultPost.author,
          category: defaultPost.category,
          createdAt: defaultPost.createdAt,
          upvotes: 0,
          comments: [],
        },
        {
          id: 3,
          title: 'The Concept of Karma and Free Will',
          content: '<p>On karma and free will...</p>',
          author: defaultPost.author,
          category: defaultPost.category,
          createdAt: defaultPost.createdAt,
          upvotes: 0,
          comments: [],
        }
      ];
      
      const foundPost = defaultPosts.find(p => p.id === id || p.id === postId);
      return normalizePost(foundPost || defaultPost);
    } catch (error) {
      console.error('Error finding post:', error);
      return normalizePost(defaultPost);
    }
  };
  
  const [post, setPost] = useState(() => findPostById(postId));

  const [commentText, setCommentText] = useState('');
  const [upvotes, setUpvotes] = useState(Number(post.upvotes || 0));
  const [isSaved, setIsSaved] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('savedPosts') || '[]');
      return saved.some(p => p.id === post.id);
    } catch {
      return false;
    }
  });
  const [comments, setComments] = useState(Array.isArray(post.comments) ? post.comments : []);
  const [replyOpenIds, setReplyOpenIds] = useState(new Set());
  const [replyTexts, setReplyTexts] = useState({});
  const [hasUpvotedPost, setHasUpvotedPost] = useState(() => {
    try {
      const up = JSON.parse(localStorage.getItem('upvotedPosts') || '[]');
      return up.includes(post.id);
    } catch {
      return false;
    }
  });
  const [upvotedCommentIds, setUpvotedCommentIds] = useState(() => {
    try {
      const arr = JSON.parse(localStorage.getItem(`upvotedComments_${post.id}`) || '[]');
      return new Set(Array.isArray(arr) ? arr : []);
    } catch {
      return new Set();
    }
  });

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    alert('Comment submitted: ' + commentText);
    setCommentText('');
  };

  const handleUpvotePost = async () => {
    try {
      const list = JSON.parse(localStorage.getItem('upvotedPosts') || '[]');
      if (hasUpvotedPost) {
        setUpvotes((u) => Math.max(0, u - 1));
        const next = list.filter((pid) => pid !== post.id);
        localStorage.setItem('upvotedPosts', JSON.stringify(next));
        setHasUpvotedPost(false);
      } else {
        setUpvotes((u) => u + 1);
        const next = [post.id, ...list.filter((pid) => pid !== post.id)];
        localStorage.setItem('upvotedPosts', JSON.stringify(next));
        setHasUpvotedPost(true);
        try {
          await postService.upvotePost(post.id);
        } catch (err) {
          console.warn('Post upvote API failed, using local toggle.', err);
        }
      }
    } catch (err) {
      console.error('Upvote toggle error', err);
    }
  };

  const handleToggleSave = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('savedPosts') || '[]');
      let next;
      if (isSaved) {
        next = saved.filter((p) => p.id !== post.id);
        setIsSaved(false);
      } else {
        next = [{ id: post.id, title: post.title, category: post.category, createdAt: post.createdAt }, ...saved];
        setIsSaved(true);
      }
      localStorage.setItem('savedPosts', JSON.stringify(next));
    } catch (err) {
      console.error('Save toggle error', err);
    }
  };

  const handleUpvoteComment = async (commentId) => {
    const wasUpvoted = upvotedCommentIds.has(commentId);
    // Adjust counts locally
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId ? { ...c, upvotes: c.upvotes + (wasUpvoted ? -1 : 1) } : c
      )
    );
    // Persist per-post upvoted set
    setUpvotedCommentIds((prevSet) => {
      const next = new Set(prevSet);
      if (next.has(commentId)) {
        next.delete(commentId);
      } else {
        next.add(commentId);
      }
      localStorage.setItem(`upvotedComments_${post.id}`, JSON.stringify(Array.from(next)));
      return next;
    });

    // Persist global liked comments list for listing page
    try {
      const list = JSON.parse(localStorage.getItem('likedComments') || '[]');
      const target = comments.find((c) => c.id === commentId);
      const exists = (item) => item.type === 'post' && item.parentId === post.id && item.commentId === commentId;
      if (!wasUpvoted) {
        const newItem = {
          type: 'post',
          parentId: post.id,
          parentTitle: post.title,
          commentId,
          author: target?.author || 'Unknown',
          content: target?.content || '',
          createdAt: target?.createdAt || new Date().toISOString(),
        };
        const next = [newItem, ...list.filter((i) => !exists(i))];
        localStorage.setItem('likedComments', JSON.stringify(next));
      } else {
        const next = list.filter((i) => !exists(i));
        localStorage.setItem('likedComments', JSON.stringify(next));
      }
    } catch (e) {
      console.warn('Failed to persist liked comment globally', e);
    }

    // Call API only on upvote (backend lacks unupvote)
    try {
      if (!wasUpvoted) {
        await commentService.upvoteComment(commentId);
      }
    } catch (err) {
      console.warn('Comment upvote API failed, using local toggle.', err);
    }
  };

  const toggleReplyForComment = (commentId) => {
    setReplyOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(commentId)) next.delete(commentId);
      else next.add(commentId);
      return next;
    });
  };

  const handleReplyTextChange = (commentId, text) => {
    setReplyTexts((prev) => ({ ...prev, [commentId]: text }));
  };

  const handleSubmitReply = async (commentId) => {
    const text = (replyTexts[commentId] || '').trim();
    if (!text) return;
    const newId = (comments.reduce((m, c) => Math.max(m, c.id), 0) || 0) + 1;
    const newComment = {
      id: newId,
      content: text,
      author: 'You',
      createdAt: new Date().toISOString(),
      upvotes: 0,
    };
    setComments((prev) => {
      const idx = prev.findIndex((c) => c.id === commentId);
      if (idx >= 0) {
        const next = [...prev.slice(0, idx + 1), newComment, ...prev.slice(idx + 1)];
        return next;
      }
      return [...prev, newComment];
    });
    try {
      await commentService.createComment({ postId: post.id, content: text, parentId: commentId });
    } catch (err) {
      console.warn('Reply create API failed; kept local copy.', err);
    }
    setReplyTexts((prev) => {
      const { [commentId]: _, ...rest } = prev;
      return rest;
    });
    setReplyOpenIds((prev) => {
      const next = new Set(prev);
      next.delete(commentId);
      return next;
    });
  };

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-8">
          {/* Post Header */}
          <div className="mb-4">
            <div className="d-flex align-items-center mb-2">
              <Link to={`/category/${post.category.toLowerCase()}`} className="badge me-2" style={{ backgroundColor: 'var(--saffron)' }}>
                {post.category}
              </Link>
              <span className="text-muted">{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
            <h1 className="mb-3" style={{ color: 'var(--peacock-blue)' }}>{post.title}</h1>
            <div className="d-flex align-items-center">
              <img 
                src={post.author.avatar} 
                alt={post.author.name} 
                className="rounded-circle me-2" 
                width="40" 
                height="40" 
              />
              <div>
                <Link to={`/profile/${post.author.id}`} className="text-decoration-none fw-bold" style={{ color: 'var(--peacock-blue)' }}>
                  {post.author.name}
                </Link>
                <div className="small text-muted">Reputation: {post.author.reputation}</div>
              </div>
            </div>
          </div>

          {/* Post Content */}
          <div className="indian-border mb-4">
            <div className="sabha-card-body" dangerouslySetInnerHTML={{ __html: post.content }}></div>
          </div>

          {/* Post Actions */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <button className={`btn ${hasUpvotedPost ? 'btn-primary' : 'btn-outline-primary'} me-2`} onClick={handleUpvotePost}>
                <i className="bi bi-hand-thumbs-up me-1"></i> Upvote ({upvotes})
              </button>
              <button
                className={`btn ${isSaved ? 'btn-secondary' : 'btn-outline-secondary'}`}
                onClick={handleToggleSave}
              >
                <i className={`bi ${isSaved ? 'bi-bookmark-fill' : 'bi-bookmark'} me-1`}></i> {isSaved ? 'Saved' : 'Save'}
              </button>
            </div>
            <div>
              <button className="btn btn-outline-secondary">
                <i className="bi bi-share me-1"></i> Share
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mb-4">
            <h3 className="mb-4">Comments</h3>
            
            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="mb-4">
              <div className="mb-3">
                <textarea 
                  className="form-control" 
                  rows="3" 
                  placeholder="Add your thoughts..." 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">Post Comment</button>
            </form>
            
            {/* Comments List */}
            {comments.map(comment => (
              <div key={comment.id} className="indian-border mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <div className="fw-bold">{comment.author}</div>
                  <small className="text-muted">{new Date(comment.createdAt).toLocaleDateString()}</small>
                </div>
                <p className="mb-2">{comment.content}</p>
                <div className="d-flex align-items-center">
                  <button className={`btn btn-sm btn-link text-decoration-none ${upvotedCommentIds.has(comment.id) ? 'text-primary' : ''}`} onClick={() => handleUpvoteComment(comment.id)}>
                    <i className="bi bi-hand-thumbs-up me-1"></i> {comment.upvotes}
                  </button>
                  <button className="btn btn-sm btn-link text-decoration-none ms-2" onClick={() => toggleReplyForComment(comment.id)}>Reply</button>
                </div>
                {replyOpenIds.has(comment.id) && (
                  <div className="mt-2">
                    <textarea
                      className="form-control form-control-sm"
                      rows="2"
                      placeholder="Write a reply..."
                      value={replyTexts[comment.id] || ''}
                      onChange={(e) => handleReplyTextChange(comment.id, e.target.value)}
                    ></textarea>
                    <div className="mt-2">
                      <button className="btn btn-primary btn-sm me-2" onClick={() => handleSubmitReply(comment.id)}>Post Reply</button>
                      <button className="btn btn-secondary btn-sm" onClick={() => toggleReplyForComment(comment.id)}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="col-lg-4">
          <div className="indian-border mb-4">
            <h4 className="lotus-header">Related Posts</h4>
            <div className="list-group list-group-flush">
              <Link to="/post/2" className="list-group-item list-group-item-action">
                <div className="fw-bold">Dvaita vs Advaita: A Comparative Study</div>
                <small className="text-muted">By Madhvacharya</small>
              </Link>
              <Link to="/post/3" className="list-group-item list-group-item-action">
                <div className="fw-bold">The Concept of Maya in Vedantic Philosophy</div>
                <small className="text-muted">By Vivekananda</small>
              </Link>
              <Link to="/post/4" className="list-group-item list-group-item-action">
                <div className="fw-bold">Understanding Brahman: The Ultimate Reality</div>
                <small className="text-muted">By Ramana Maharshi</small>
              </Link>
            </div>
          </div>
          
          <div className="indian-border">
            <h4 className="lotus-header">Start a Debate</h4>
            <p>Have a different perspective on Advaita Vedanta?</p>
            <Link to="/create-debate" className="btn btn-primary w-100">Create a Debate Thread</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;