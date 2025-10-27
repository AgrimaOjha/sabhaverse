import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const HomePage = ({ user }) => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('home');
  
  useEffect(() => {
    if (location.pathname === '/debates') {
      setActiveTab('debates');
    } else if (location.pathname === '/posts') {
      setActiveTab('posts');
    } else if (location.pathname.includes('/category/')) {
      setActiveTab('category');
    } else if (location.pathname === '/categories') {
      setActiveTab('categories');
    } else if (location.pathname === '/') {
      setActiveTab('home');
    } else {
      setActiveTab('home');
    }
  }, [location]);
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    // Load posts from localStorage if available
    const savedPosts = JSON.parse(localStorage.getItem('userPosts') || '[]');
    
    // Combine with default posts
    const defaultPosts = [
      {
        id: 1,
        title: 'The Philosophy of Advaita Vedanta',
        excerpt: 'Exploring the non-dualistic approach to understanding reality and consciousness...',
        author: 'Adi Shankar',
        category: 'Philosophy',
        upvotes: 42,
        commentCount: 15,
        createdAt: '2023-06-15'
      },
      {
        id: 2,
        title: 'Ayurvedic Remedies for Modern Lifestyle',
        excerpt: 'How ancient Ayurvedic practices can help balance the challenges of contemporary living...',
        author: 'Charaka',
        category: 'Ayurveda',
        upvotes: 38,
        commentCount: 12,
        createdAt: '2023-06-12'
      },
      {
        id: 3,
        title: 'The Evolution of Carnatic Music',
        excerpt: 'Tracing the historical development of Carnatic music traditions through the centuries...',
        author: 'Thyagaraja',
      category: 'Music',
      upvotes: 35,
      commentCount: 8,
      createdAt: '2023-06-10'
    }
    ];
    
    // Combine saved posts with default posts
    // Use higher IDs for user posts to avoid conflicts
    const allPosts = [...defaultPosts, ...savedPosts];
    setPosts(allPosts);
  }, []);

  // Mock data for featured debate
  const featuredDebate = {
    id: 1,
    title: 'Is Yoga primarily spiritual or physical in nature?',
    description: 'Exploring the origins and purpose of yoga practices in modern context',
    proponentCount: 12,
    opponentCount: 8,
    neutralCount: 5
  };

  // Mock data for debates
  const [debates] = useState([
    {
      id: 1,
      title: 'Is Yoga primarily spiritual or physical in nature?',
      description: 'Exploring the origins and purpose of yoga practices in modern context',
      proponentCount: 12,
      opponentCount: 8,
      neutralCount: 5,
      createdAt: '2023-06-10'
    },
    {
      id: 2,
      title: 'Should Sanskrit be made a mandatory language in Indian education?',
      description: 'Discussing the relevance and importance of Sanskrit in modern education',
      proponentCount: 15,
      opponentCount: 10,
      neutralCount: 7,
      createdAt: '2023-06-08'
    },
    {
      id: 3,
      title: 'Are Vedic mathematics techniques more efficient than conventional methods?',
      description: 'Comparing traditional Vedic mathematical approaches with modern techniques',
      proponentCount: 8,
      opponentCount: 6,
      neutralCount: 4,
      createdAt: '2023-06-05'
    }
  ]);

  return (
    <>
      {(activeTab === 'posts' || activeTab === 'debates') && (
        <div className="container mt-4">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <Link 
                to="/posts" 
                className={`nav-link ${activeTab === 'posts' ? 'active' : ''}`}
                style={activeTab === 'posts' ? {color: 'var(--peacock-blue)', fontWeight: 'bold'} : {}}
              >
                Posts
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/debates" 
                className={`nav-link ${activeTab === 'debates' ? 'active' : ''}`}
                style={activeTab === 'debates' ? {color: 'var(--peacock-blue)', fontWeight: 'bold'} : {}}
              >
                Debates
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/categories" 
                className={`nav-link ${activeTab === 'categories' ? 'active' : ''}`}
                style={activeTab === 'categories' ? {color: 'var(--peacock-blue)', fontWeight: 'bold'} : {}}
              >
                Categories
              </Link>
            </li>
          </ul>
        </div>
      )}

      {activeTab === 'posts' ? (
        // Posts View
        <section className="py-5">
          <div className="container">
            <h2 className="mb-4" style={{ color: 'var(--peacock-blue)' }}>All Posts</h2>
            <div className="row">
              {posts.map(post => (
                <div className="col-md-6 col-lg-4 mb-4" key={post.id}>
                  <div className="sabha-card h-100">
                    <div className="sabha-card-header d-flex justify-content-between align-items-center">
                      <span className="badge" style={{ backgroundColor: 'var(--saffron)' }}>{post.category}</span>
                      <small>{new Date(post.createdAt).toLocaleDateString()}</small>
                    </div>
                    <div className="sabha-card-body">
                      <h5 className="card-title mb-3">
                        <Link to={`/post/${post.id}`} className="text-decoration-none" style={{ color: 'var(--peacock-blue)' }}>
                          {post.title}
                        </Link>
                      </h5>
                      <p className="card-text text-muted">{post.excerpt}</p>
                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <div>
                          <span className="me-3">
                            <i className="bi bi-hand-thumbs-up me-1"></i> {post.upvotes}
                          </span>
                          <span>
                            <i className="bi bi-chat-dots me-1"></i> {post.commentCount}
                          </span>
                        </div>
                        <small className="text-muted">By {post.author}</small>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : activeTab === 'debates' ? (
        // Debates View
        <section className="py-5">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 style={{ color: 'var(--peacock-blue)' }}>All Debates</h2>
              <Link to="/create-debate" className="btn btn-primary">
                <i className="bi bi-plus-circle me-2"></i>Create Debate
              </Link>
            </div>
            <div className="row">
              {debates.map(debate => (
                <div className="col-md-6 col-lg-4 mb-4" key={debate.id}>
                  <div className="sabha-card h-100">
                    <div className="sabha-card-header d-flex justify-content-between align-items-center">
                      <span className="badge" style={{ backgroundColor: 'var(--peacock-blue)' }}>Debate</span>
                      <small>{new Date(debate.createdAt).toLocaleDateString()}</small>
                    </div>
                    <div className="sabha-card-body">
                      <h5 className="card-title mb-3">
                        <Link to={`/debate/${debate.id}`} className="text-decoration-none" style={{ color: 'var(--peacock-blue)' }}>
                          {debate.title}
                        </Link>
                      </h5>
                      <p className="card-text text-muted">{debate.description}</p>
                      <div className="d-flex justify-content-between mt-3">
                        <div className="small">
                          <span className="me-2" style={{ color: 'var(--india-green)' }}>
                            <i className="bi bi-hand-thumbs-up me-1"></i> {debate.proponentCount}
                          </span>
                          <span className="me-2" style={{ color: 'var(--clay-red)' }}>
                            <i className="bi bi-hand-thumbs-down me-1"></i> {debate.opponentCount}
                          </span>
                          <span style={{ color: 'var(--chakra-blue)' }}>
                            <i className="bi bi-circle me-1"></i> {debate.neutralCount}
                          </span>
                        </div>
                        <Link to={`/debate/${debate.id}`} className="btn btn-sm btn-outline-primary">Join</Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : activeTab === 'category' ? (
        // Category View
        <section className="py-5">
          <div className="container">
            <h2 className="mb-4" style={{ color: 'var(--peacock-blue)' }}>Category: {location.pathname.split('/').pop()}</h2>
            <div className="row">
              {posts.filter(post => post.category.toLowerCase() === location.pathname.split('/').pop()).map(post => (
                <div className="col-md-6 col-lg-4 mb-4" key={post.id}>
                  <div className="sabha-card h-100">
                    <div className="sabha-card-header d-flex justify-content-between align-items-center">
                      <span className="badge" style={{ backgroundColor: 'var(--saffron)' }}>{post.category}</span>
                      <small>{new Date(post.createdAt).toLocaleDateString()}</small>
                    </div>
                    <div className="sabha-card-body">
                      <h5 className="card-title mb-3">
                        <Link to={`/post/${post.id}`} className="text-decoration-none" style={{ color: 'var(--peacock-blue)' }}>
                          {post.title}
                        </Link>
                      </h5>
                      <p className="card-text text-muted">{post.excerpt}</p>
                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <div>
                          <span className="me-3">
                            <i className="bi bi-hand-thumbs-up me-1"></i> {post.upvotes}
                          </span>
                          <span>
                            <i className="bi bi-chat-dots me-1"></i> {post.commentCount}
                          </span>
                        </div>
                        <small className="text-muted">By {post.author}</small>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : activeTab === 'categories' ? (
        // Categories View
        <section className="py-5 bg-light">
          <div className="container">
            <h2 className="text-center mb-5" style={{ color: 'var(--peacock-blue)' }}>Explore Knowledge Categories</h2>
            <div className="row g-4">
              {['Philosophy', 'Ayurveda', 'Music', 'History', 'Yoga', 'Architecture', 'Literature', 'Science'].map((category, index) => (
                <div className="col-md-6 col-lg-3" key={index}>
                  <Link to={`/category/${category.toLowerCase()}`} className="text-decoration-none">
                    <div className="card h-100 border-0 shadow-sm indian-border">
                      <div className="card-body text-center">
                        <div className="mb-3">
                          <span className="display-5" style={{ color: 'var(--saffron)' }}>
                            <i className={`bi bi-${['book', 'heart-pulse', 'music-note', 'hourglass', 'person', 'building', 'journal', 'lightbulb'][index]}`}></i>
                          </span>
                        </div>
                        <h5 className="card-title" style={{ color: 'var(--peacock-blue)' }}>{category}</h5>
                        <p className="card-text text-muted">Explore the rich traditions of {category} in Indian Knowledge Systems</p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        // Default Home View
        <>
          <section className="py-5" style={{ 
            background: 'linear-gradient(135deg, var(--rangoli-purple) 0%, var(--mehendi-green) 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '5px',
              background: 'linear-gradient(90deg, var(--saffron), var(--lotus-pink), var(--spice-orange), var(--marigold))'
            }}></div>
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '5px',
              background: 'linear-gradient(90deg, var(--marigold), var(--spice-orange), var(--lotus-pink), var(--saffron))'
            }}></div>
            <div className="container py-5">
              <div className="row align-items-center">
                <div className="col-lg-12 mb-4 mb-lg-0 text-center text-lg-start">
                  <h1 className="display-4 fw-bold mb-3" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.2)'}}>Welcome to SabhaVerse</h1>
                  <p className="lead mb-4">A digital platform for exploring and discussing Indian Knowledge Systems through structured debates and insightful conversations.</p>
                  <div className="d-flex flex-column flex-sm-row gap-2">
                    {!user && (
                      <Link to="/signup" className="btn btn-lg w-100 w-sm-auto" style={{ 
                        background: 'linear-gradient(135deg, var(--spice-orange), var(--saffron))', 
                        color: 'white',
                        border: 'none',
                        boxShadow: '0 4px 10px rgba(255, 153, 51, 0.3)'
                      }}>
                        Join the Sabha
                      </Link>
                    )}
                    <Link to="/debates" className="btn btn-lg w-100 w-sm-auto" style={{
                      background: 'linear-gradient(135deg, var(--henna-brown), var(--clay-red))',
                      color: 'white',
                      border: 'none',
                      boxShadow: '0 4px 10px rgba(185, 43, 39, 0.3)'
                    }}>
                      Explore Debates
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-5" style={{ background: 'var(--silk-cream)' }}>
            <div className="container">
              <h2 className="text-center mb-5" style={{ 
                color: 'var(--henna-brown)',
                textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
              }}>Explore Knowledge Categories</h2>
              <div className="row g-4">
                {[
                  { name: 'Philosophy', icon: 'book', color: 'var(--rangoli-purple)' },
                  { name: 'Ayurveda', icon: 'heart-pulse', color: 'var(--mehendi-green)' },
                  { name: 'Music', icon: 'music-note', color: 'var(--spice-orange)' },
                  { name: 'History', icon: 'hourglass', color: 'var(--henna-brown)' },
                  { name: 'Yoga', icon: 'person', color: 'var(--banyan-green)' },
                  { name: 'Architecture', icon: 'building', color: 'var(--kolam-blue)' },
                  { name: 'Literature', icon: 'journal', color: 'var(--jaipur-pink)' },
                  { name: 'Science', icon: 'lightbulb', color: 'var(--madhubani-teal)' }
                ].map((category, index) => (
                  <div className="col-md-6 col-lg-3" key={index}>
                    <Link to={`/category/${category.name.toLowerCase()}`} className="text-decoration-none">
                      <div className="card h-100 border-0 shadow-sm" style={{
                        borderRadius: '12px',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        background: 'white'
                      }}>
                        <div style={{
                          height: '8px',
                          background: category.color
                        }}></div>
                        <div className="card-body text-center">
                          <div className="mb-3" style={{
                            width: '70px',
                            height: '70px',
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${category.color}, white)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                          }}>
                            <span className="display-6" style={{ color: 'var(--text-dark)' }}>
                              <i className={`bi bi-${category.icon}`}></i>
                            </span>
                          </div>
                          <h5 className="card-title" style={{ color: category.color }}>{category.name}</h5>
                          <p className="card-text text-muted">Explore the rich traditions of {category.name} in Indian Knowledge Systems</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Latest Posts Section */}
          <section className="py-5">
            <div className="container">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 style={{ color: 'var(--peacock-blue)' }}>Latest Discussions</h2>
                <Link to="/posts" className="btn btn-outline-primary">View All</Link>
              </div>
              <div className="row">
                {posts.map(post => (
                  <div className="col-md-6 col-lg-4 mb-4" key={post.id}>
                    <div className="sabha-card h-100">
                      <div className="sabha-card-header d-flex justify-content-between align-items-center">
                        <span className="badge" style={{ backgroundColor: 'var(--saffron)' }}>{post.category}</span>
                        <small>{new Date(post.createdAt).toLocaleDateString()}</small>
                      </div>
                      <div className="sabha-card-body">
                        <h5 className="card-title mb-3">
                          <Link to={`/post/${post.id}`} className="text-decoration-none" style={{ color: 'var(--peacock-blue)' }}>
                            {post.title}
                          </Link>
                        </h5>
                        <p className="card-text text-muted">{post.excerpt}</p>
                        <div className="d-flex justify-content-between align-items-center mt-3">
                          <div>
                            <span className="me-3">
                              <i className="bi bi-hand-thumbs-up me-1"></i> {post.upvotes}
                            </span>
                            <span>
                              <i className="bi bi-chat-dots me-1"></i> {post.commentCount}
                            </span>
                          </div>
                          <small className="text-muted">By {post.author}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Featured Debate Section */}
          <section className="py-5" style={{ background: 'linear-gradient(135deg, var(--silk-cream), white)' }}>
            <div className="container">
              <h2 className="text-center mb-5 lotus-header">Featured Debate</h2>
              <div className="indian-border p-4" style={{ 
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                borderTop: '5px solid var(--jaipur-pink)'
              }}>
                <h3 className="mb-3" style={{ color: 'var(--madhubani-teal)' }}>{featuredDebate.title}</h3>
                <p className="mb-4">{featuredDebate.description}</p>
                <div className="row mb-4">
                  <div className="col-md-4 mb-3 mb-md-0">
                    <div className="card text-center h-100" style={{ 
                      background: 'linear-gradient(to bottom, white, #f8fff8)',
                      borderRadius: '12px',
                      boxShadow: '0 4px 15px rgba(19, 136, 8, 0.15)',
                      border: 'none',
                      overflow: 'hidden'
                    }}>
                      <div style={{ height: '5px', background: 'var(--banyan-green)' }}></div>
                      <div className="card-body">
                        <h5 className="card-title" style={{ color: 'var(--banyan-green)' }}>Proponents</h5>
                        <p className="card-text display-6" style={{ color: 'var(--banyan-green)' }}>{featuredDebate.proponentCount}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3 mb-md-0">
                    <div className="card text-center h-100" style={{ 
                      background: 'linear-gradient(to bottom, white, #fff8f8)',
                      borderRadius: '12px',
                      boxShadow: '0 4px 15px rgba(227, 38, 54, 0.15)',
                      border: 'none',
                      overflow: 'hidden'
                    }}>
                      <div style={{ height: '5px', background: 'var(--gulmohar-red)' }}></div>
                      <div className="card-body">
                        <h5 className="card-title" style={{ color: 'var(--gulmohar-red)' }}>Opponents</h5>
                        <p className="card-text display-6" style={{ color: 'var(--gulmohar-red)' }}>{featuredDebate.opponentCount}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card text-center h-100" style={{ 
                      background: 'linear-gradient(to bottom, white, #f8f8ff)',
                      borderRadius: '12px',
                      boxShadow: '0 4px 15px rgba(93, 138, 168, 0.15)',
                      border: 'none',
                      overflow: 'hidden'
                    }}>
                      <div style={{ height: '5px', background: 'var(--kolam-blue)' }}></div>
                      <div className="card-body">
                        <h5 className="card-title" style={{ color: 'var(--kolam-blue)' }}>Neutral</h5>
                        <p className="card-text display-6" style={{ color: 'var(--kolam-blue)' }}>{featuredDebate.neutralCount}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <Link to={`/debate/${featuredDebate.id}`} className="btn btn-primary" style={{
                    background: 'linear-gradient(135deg, var(--jaipur-pink), var(--rangoli-purple))',
                    border: 'none',
                    padding: '10px 25px',
                    borderRadius: '30px',
                    boxShadow: '0 4px 15px rgba(213, 62, 132, 0.3)'
                  }}>Join the Debate</Link>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
      <section className="py-5" style={{ 
        background: 'linear-gradient(135deg, var(--saffron) 0%, var(--turmeric) 100%)',
        color: 'white'
      }}>
        <div className="container text-center py-4">
          <h2 className="mb-4">Ready to share your knowledge?</h2>
          <p className="lead mb-4">Join our community of scholars and enthusiasts exploring the rich traditions of Indian Knowledge Systems.</p>
          {!user && (
            <Link to="/signup" className="btn btn-lg w-100 w-sm-auto" style={{ backgroundColor: 'white', color: 'var(--peacock-blue)' }}>
              Create an Account
            </Link>
          )}
        </div>
      </section>
    </>
  );
};

export default HomePage;