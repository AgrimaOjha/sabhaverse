import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateDebate = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Philosophy');
  
  const categories = [
    'Philosophy', 'Education', 'Mathematics', 'Science', 
    'Culture', 'Politics', 'Religion', 'Technology', 'Arts', 'General'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      alert('Please fill in all required fields');
      return;
    }
    
    const newDebate = {
      id: Date.now(),
      title,
      description,
      category,
      createdAt: new Date().toISOString(),
      createdBy: {
        id: 0,
        name: 'You',
        avatar: 'https://placehold.co/100',
        reputation: 0
      },
      comments: []
    };
    
    try {
      const userDebates = JSON.parse(localStorage.getItem('userDebates') || '[]');
      userDebates.push(newDebate);
      localStorage.setItem('userDebates', JSON.stringify(userDebates));
      
      // Navigate to the newly created debate
      navigate(`/debate/${newDebate.id}`);
    } catch (err) {
      console.error('Failed to save debate', err);
      alert('Failed to create debate. Please try again.');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h1 className="mb-4" style={{ color: 'var(--peacock-blue)' }}>Create New Debate</h1>
          
          <div className="indian-border mb-4">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="debateTitle" className="form-label">Debate Title</label>
                <input
                  type="text"
                  className="form-control"
                  id="debateTitle"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a clear, concise title for your debate"
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="debateDescription" className="form-label">Description</label>
                <textarea
                  className="form-control"
                  id="debateDescription"
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide context and frame the debate question clearly"
                  required
                ></textarea>
              </div>
              
              <div className="mb-3">
                <label htmlFor="debateCategory" className="form-label">Category</label>
                <select
                  className="form-select"
                  id="debateCategory"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div className="d-grid gap-2">
                <button type="submit" className="btn btn-primary">Create Debate</button>
                <button 
                  type="button" 
                  className="btn btn-outline-secondary"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
          
          <div className="indian-border">
            <h4 className="lotus-header">Debate Guidelines</h4>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">Frame your debate as a clear question or proposition</li>
              <li className="list-group-item">Choose a specific topic rather than something too broad</li>
              <li className="list-group-item">Provide enough context in the description</li>
              <li className="list-group-item">Select the most appropriate category</li>
              <li className="list-group-item">Be respectful and open to different viewpoints</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDebate;