import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="lp-navbar">
      <div className="lp-navbar-container">
        <Link to="/" className="lp-navbar-logo">
          <span className="logo-icon">⚡</span>
          LivePoll
        </Link>
        <div className="lp-navbar-links">
          <Link
            to="/"
            className={`lp-nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link
            to="/create"
            className={`lp-nav-link lp-nav-link-cta ${location.pathname === '/create' ? 'active' : ''}`}
          >
            + Create Poll
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;