import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer mt-auto">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4 mb-md-0">
            <h5 className="text-uppercase mb-4" style={{ color: '#FFC30B' }}>SabhaVerse</h5>
            <p>A digital platform for Indian Knowledge Systems where enthusiasts can share ideas, participate in structured debates, and explore the rich heritage of Indian wisdom.</p>
          </div>
          
          <div className="col-md-2 mb-4 mb-md-0">
            <h5 className="text-uppercase mb-4" style={{ color: '#FFC30B' }}>Explore</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/category/philosophy" className="text-white text-decoration-none">Philosophy</Link></li>
              <li className="mb-2"><Link to="/category/ayurveda" className="text-white text-decoration-none">Ayurveda</Link></li>
              <li className="mb-2"><Link to="/category/music" className="text-white text-decoration-none">Music</Link></li>
              <li className="mb-2"><Link to="/category/history" className="text-white text-decoration-none">History</Link></li>
            </ul>
          </div>
          
          <div className="col-md-2 mb-4 mb-md-0">
            <h5 className="text-uppercase mb-4" style={{ color: '#FFC30B' }}>Community</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/debates" className="text-white text-decoration-none">Debates</Link></li>
              <li className="mb-2"><Link to="/scholars" className="text-white text-decoration-none">Scholars</Link></li>
              <li className="mb-2"><Link to="/guidelines" className="text-white text-decoration-none">Guidelines</Link></li>
              <li className="mb-2"><Link to="/faq" className="text-white text-decoration-none">FAQ</Link></li>
            </ul>
          </div>
          
          <div className="col-md-4">
            <h5 className="text-uppercase mb-4" style={{ color: '#FFC30B' }}>Connect</h5>
            <p>Join our newsletter to stay updated on the latest discussions and events.</p>
            <div className="d-flex">
              <input type="email" className="form-control me-2" placeholder="Your email" />
              <button className="btn" style={{ backgroundColor: '#FF9933', color: 'white' }}>Subscribe</button>
            </div>
            <div className="mt-4">
              <a href="http" className="text-white me-3"><i className="bi bi-facebook"></i></a>
              <a href="http" className="text-white me-3"><i className="bi bi-twitter"></i></a>
              <a href="http" className="text-white me-3"><i className="bi bi-instagram"></i></a>
              <a href="http" className="text-white"><i className="bi bi-youtube"></i></a>
            </div>
          </div>
        </div>
        
        <hr className="my-4" style={{ backgroundColor: '#FFC30B', opacity: 0.5 }} />
        
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <p className="mb-0">© 2023 SabhaVerse. All rights reserved.</p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <ul className="list-inline mb-0">
              <li className="list-inline-item"><Link to="/terms" className="text-white text-decoration-none">Terms</Link></li>
              <li className="list-inline-item ms-3"><Link to="/privacy" className="text-white text-decoration-none">Privacy</Link></li>
              <li className="list-inline-item ms-3"><Link to="/contact" className="text-white text-decoration-none">Contact</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;