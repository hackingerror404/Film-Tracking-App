import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

export default function Header() {
  const { profile, signOut } = useAuth();
  const location = useLocation();

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <span className="logo-icon">🎬</span>
          <span className="logo-text">Film Shoot Tracker</span>
        </Link>

        {profile && (
          <nav className="nav">
            <Link
              to="/"
              className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
            >
              Feed
            </Link>
            <Link
              to="/create"
              className={location.pathname === '/create' ? 'nav-link active' : 'nav-link'}
            >
              Post Shoot
            </Link>
            <Link
              to="/profile"
              className={location.pathname === '/profile' ? 'nav-link active' : 'nav-link'}
            >
              Profile
            </Link>
            <button onClick={signOut} className="sign-out-button">
              Sign Out
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}
