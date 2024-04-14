import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LandingPage.css';

export default function LandingNav({ userLoggedIn }) {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    window.sessionStorage.setItem('UserType', '');
    window.sessionStorage.setItem('UserId', '');
    navigate("/login");
  };

  return (
    <div className="navbar">
      <div className="navbar-container">
        <Link to={userLoggedIn === 'admin' ? '/admin' : userLoggedIn === 'customer' ? '/home' : '/'} className="navbar-logo">
          ForeverTie
        </Link>

        <ul className="nav-menu">
          {userLoggedIn === 'admin' && (
            <>
              <li className="nav-item">
                <Link to="/venues">
                  Venue
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/caters">
                  Caterer
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/decors">
                  Decorer
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/payments">
                  Payments
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/login" className="nav-links" onClick={handleLogoutClick}>
                  Logout
                </Link>
              </li>
            </>
          )}
          {userLoggedIn === 'customer' && (
            <>
              <li className="nav-item">
                <Link to="/venue">
                  Venue
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/cater">
                  Caterer
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/decor">
                  Decorer
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/cart">
                  cart
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/login" className="nav-links" onClick={handleLogoutClick}>
                  Logout
                </Link>
              </li>
            </>
          )}
          {!userLoggedIn && (
            <li className="nav-item">
              <Link to="/login" className="nav-links">
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
