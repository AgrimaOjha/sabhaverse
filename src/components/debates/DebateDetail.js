import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { debateService } from '../../services/api';

const DebateDetail = () => {
  const { id } = useParams();
  const debateId = parseInt(id) || 1;
  // Mock data for a debate - in a real app, this would come from an API
  const [debate] = useState({
    id: debateId,
    title: 'Is Yoga primarily spiritual or physical in nature?',
    description: 'This debate explores the origins and purpose of yoga practices in modern context. Is yoga primarily a spiritual discipline with physical benefits, or has it evolved into a physical practice with spiritual elements?',
    createdBy: {
      id: 1,
      name: 'Patanjali',
      avatar: 'https://placehold.co/100',
      reputation: 1850
    },
    createdAt: '2023-06-10',
    category: 'Philosophy',
    comments: [
      {
        id: 1,
        content: 'Yoga is fundamentally a spiritual practice. The physical postures (asanas) are just one of the eight limbs of yoga as described in Patanjali\'s Yoga Sutras. The ultimate goal is spiritual enlightenment (samadhi), not physical fitness.',
        author: 'Swami Vivekananda',
        createdAt: '2023-06-11',
        role: 'proponent',
        upvotes: 15
      },
      {
        id: 2,
        content: 'While yoga has spiritual roots, it has evolved significantly in modern times. Today, many practitioners approach yoga primarily as a physical practice for health and wellness, with the spiritual aspects being secondary or optional.',
        author: 'Modern Yogi',
        createdAt: '2023-06-12',
        role: 'opponent',
        upvotes: 12
      },
      {
        id: 3,
        content: 'I believe both perspectives have merit. Yoga\'s origins are undeniably spiritual, but its practice has evolved to accommodate different needs and cultural contexts. Perhaps the physical and spiritual aspects are inseparable, forming a holistic system.',
        author: 'Balanced View',
        createdAt: '2023-06-13',
        role: 'neutral',
        upvotes: 8
      }
    ]
  });

  const [commentText, setCommentText] = useState('');
  const [selectedRole, setSelectedRole] = useState('neutral');
  const [comments, setComments] = useState(debate.comments);
  const [upvotedReplyIds, setUpvotedReplyIds] = useState(() => {
    try {
      const arr = JSON.parse(localStorage.getItem(`upvotedDebateReplies_${debate.id}`) || '[]');
      return new Set(Array.isArray(arr) ? arr : []);
    } catch {
      return new Set();
    }
  });
  const [replyOpenIds, setReplyOpenIds] = useState(new Set());
  const [replyTexts, setReplyTexts] = useState({});

  const handleUpvoteReply = (replyId) => {
    const key = String(replyId);
    const wasUpvoted = upvotedReplyIds.has(key);
    // Adjust counts locally
    setComments((prev) => prev.map((c) => (
      c.id === replyId ? { ...c, upvotes: c.upvotes + (wasUpvoted ? -1 : 1) } : c
    )));
    // Persist per-debate upvoted set
    setUpvotedReplyIds((prevSet) => {
      const next = new Set(prevSet);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      localStorage.setItem(`upvotedDebateReplies_${debate.id}`, JSON.stringify(Array.from(next)));
      return next;
    });

    // Persist global liked comments list for listing page
    try {
      const list = JSON.parse(localStorage.getItem('likedComments') || '[]');
      const target = comments.find((c) => c.id === replyId);
      const exists = (item) => item.type === 'debate' && item.parentId === debate.id && item.commentId === replyId;
      if (!wasUpvoted) {
        const newItem = {
          type: 'debate',
          parentId: debate.id,
          parentTitle: debate.title,
          commentId: replyId,
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
      console.warn('Failed to persist liked debate comment globally', e);
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
    const newReply = {
      id: Date.now(),
      content: text,
      author: 'You',
      createdAt: new Date().toISOString(),
      role: 'neutral',
      upvotes: 0,
    };
    setComments((prev) => prev.map((c) =>
      c.id === commentId
        ? { ...c, replies: Array.isArray(c.replies) ? [...c.replies, newReply] : [newReply] }
        : c
    ));
    setReplyTexts((prev) => ({ ...prev, [commentId]: '' }));
    setReplyOpenIds((prev) => {
      const next = new Set(prev);
      next.delete(commentId);
      return next;
    });
    try {
      await debateService.addReply(debate.id, commentId, newReply);
    } catch (err) {
      console.error('Failed to add reply via API; kept locally.', err);
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send the comment to an API
    alert(`Comment submitted as ${selectedRole}: ${commentText}`);
    setCommentText('');
  };

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-8">
          {/* Debate Header */}
          <div className="mb-4">
            <div className="d-flex align-items-center mb-2">
              <Link to={`/category/${debate.category.toLowerCase()}`} className="badge me-2" style={{ backgroundColor: 'var(--saffron)' }}>
                {debate.category}
              </Link>
              <span className="text-muted">{new Date(debate.createdAt).toLocaleDateString()}</span>
            </div>
            <h1 className="mb-3" style={{ color: 'var(--peacock-blue)' }}>{debate.title}</h1>
            <div className="d-flex align-items-center mb-3">
              <img 
                src={debate.createdBy.avatar} 
                alt={debate.createdBy.name} 
                className="rounded-circle me-2" 
                width="40" 
                height="40" 
              />
              <div>
                <Link to={`/profile/${debate.createdBy.id}`} className="text-decoration-none fw-bold" style={{ color: 'var(--peacock-blue)' }}>
                  {debate.createdBy.name}
                </Link>
                <div className="small text-muted">Reputation: {debate.createdBy.reputation}</div>
              </div>
            </div>
            <div className="indian-border mb-4">
              <p className="mb-0">{debate.description}</p>
            </div>
          </div>

          {/* Debate Stats */}
          <div className="row mb-4">
            <div className="col-md-4 mb-3 mb-md-0">
              <div className="card text-center h-100" style={{ borderColor: 'var(--india-green)' }}>
                <div className="card-body">
                  <h5 className="card-title" style={{ color: 'var(--india-green)' }}>Proponents</h5>
                  <p className="card-text display-6">
                    {debate.comments.filter(c => c.role === 'proponent').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3 mb-md-0">
              <div className="card text-center h-100" style={{ borderColor: 'var(--clay-red)' }}>
                <div className="card-body">
                  <h5 className="card-title" style={{ color: 'var(--clay-red)' }}>Opponents</h5>
                  <p className="card-text display-6">
                    {debate.comments.filter(c => c.role === 'opponent').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-center h-100" style={{ borderColor: 'var(--chakra-blue)' }}>
                <div className="card-body">
                  <h5 className="card-title" style={{ color: 'var(--chakra-blue)' }}>Neutral</h5>
                  <p className="card-text display-6">
                    {debate.comments.filter(c => c.role === 'neutral').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mb-4">
            <h3 className="mb-4">Debate Responses</h3>
            
            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="mb-4 indian-border">
              <div className="mb-3">
                <label className="form-label">Your stance in this debate:</label>
                <div className="d-flex gap-2">
                  <div className="form-check">
                    <input 
                      className="form-check-input" 
                      type="radio" 
                      name="debateRole" 
                      id="roleProponent" 
                      value="proponent"
                      checked={selectedRole === 'proponent'}
                      onChange={() => setSelectedRole('proponent')}
                    />
                    <label className="form-check-label" htmlFor="roleProponent" style={{ color: 'var(--india-green)' }}>
                      Proponent
                    </label>
                  </div>
                  <div className="form-check">
                    <input 
                      className="form-check-input" 
                      type="radio" 
                      name="debateRole" 
                      id="roleOpponent" 
                      value="opponent"
                      checked={selectedRole === 'opponent'}
                      onChange={() => setSelectedRole('opponent')}
                    />
                    <label className="form-check-label" htmlFor="roleOpponent" style={{ color: 'var(--clay-red)' }}>
                      Opponent
                    </label>
                  </div>
                  <div className="form-check">
                    <input 
                      className="form-check-input" 
                      type="radio" 
                      name="debateRole" 
                      id="roleNeutral" 
                      value="neutral"
                      checked={selectedRole === 'neutral'}
                      onChange={() => setSelectedRole('neutral')}
                    />
                    <label className="form-check-label" htmlFor="roleNeutral" style={{ color: 'var(--chakra-blue)' }}>
                      Neutral
                    </label>
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <textarea 
                  className="form-control" 
                  rows="4" 
                  placeholder="Share your perspective..." 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">Submit Response</button>
            </form>
            
            {/* Comments List */}
            {comments.map(comment => (
              <div 
                key={comment.id} 
                className={`${
                  comment.role === 'proponent' 
                    ? 'proponent-comment' 
                    : comment.role === 'opponent' 
                      ? 'opponent-comment' 
                      : 'neutral-comment'
                } mb-3`}
              >
                <div className="d-flex justify-content-between mb-2">
                  <div className="fw-bold">
                    {comment.author}
                    <span className="badge ms-2" style={{ 
                      backgroundColor: 
                        comment.role === 'proponent' 
                          ? 'var(--india-green)' 
                          : comment.role === 'opponent' 
                            ? 'var(--clay-red)' 
                            : 'var(--chakra-blue)'
                    }}>
                      {comment.role.charAt(0).toUpperCase() + comment.role.slice(1)}
                    </span>
                  </div>
                  <small className="text-muted">{new Date(comment.createdAt).toLocaleDateString()}</small>
                </div>
                <p className="mb-2">{comment.content}</p>
                <div className="d-flex align-items-center">
                  <button className={`btn btn-sm btn-link text-decoration-none ${upvotedReplyIds.has(String(comment.id)) ? 'text-primary' : ''}`} onClick={() => handleUpvoteReply(comment.id)}>
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
            <h4 className="lotus-header">Debate Guidelines</h4>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">Focus on ideas, not individuals</li>
              <li className="list-group-item">Provide evidence for your claims</li>
              <li className="list-group-item">Be respectful of different viewpoints</li>
              <li className="list-group-item">Avoid logical fallacies</li>
              <li className="list-group-item">Acknowledge valid points from others</li>
            </ul>
          </div>
          
          <div className="indian-border">
            <h4 className="lotus-header">Related Debates</h4>
            <div className="list-group list-group-flush">
              <Link to="/debate/2" className="list-group-item list-group-item-action">
                <div className="fw-bold">Is Ayurveda compatible with modern medicine?</div>
                <small className="text-muted">12 participants</small>
              </Link>
              <Link to="/debate/3" className="list-group-item list-group-item-action">
                <div className="fw-bold">Should Sanskrit be mandatory in Indian schools?</div>
                <small className="text-muted">24 participants</small>
              </Link>
              <Link to="/debate/4" className="list-group-item list-group-item-action">
                <div className="fw-bold">Are ancient Indian mathematical contributions undervalued?</div>
                <small className="text-muted">18 participants</small>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebateDetail;