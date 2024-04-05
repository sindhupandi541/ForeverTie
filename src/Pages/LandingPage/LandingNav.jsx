import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

export default function LandingNav({ userLoggedIn }) {
  return (
    <div className="navbar">
      <div className="navbar-container">
        {userLoggedIn === 'customer' ? (
          <Link to="/home" className="navbar-logo">
            ForeverTie
          </Link>
        ) : userLoggedIn === 'admin' ? (
          <Link to="/admin" className="navbar-logo">
            ForeverTie
          </Link>
        ) : (
          <Link to="/" className="navbar-logo">
            ForeverTie
          </Link>
        )}
        <ul className="nav-menu">
          {userLoggedIn && (
            <>
              <li className="nav-item">
                <Link to="/venue">
                  Venue
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/caterer">
                  Caterer
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/decorer">
                  Decorer
                </Link>
              </li>
            </>
          )}
          <li className="nav-item">
            <Link to={userLoggedIn ? "/logout" : "/login"} className="nav-links">
              {userLoggedIn ? 'Logout' : 'Login'}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
