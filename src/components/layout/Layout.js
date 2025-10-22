import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children, user }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar user={user} />
      <main className="flex-grow-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;