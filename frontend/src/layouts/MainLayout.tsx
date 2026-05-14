import { Link, NavLink, Outlet } from 'react-router-dom';
import { LogOut, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/layouts/MainLayout.css';

function MainLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to="/">
          AFF Cup Organizer
        </Link>
        <nav>
          <NavLink to="/matches">Schedule</NavLink>
          <NavLink to="/teams">Teams</NavLink>
          <NavLink to="/standings">Standings</NavLink>
          <NavLink to="/news">News</NavLink>
          {user && <NavLink to="/dashboard">Dashboard</NavLink>}
        </nav>
        <div className="topbar-actions">
          {user ? (
            <>
              <span>{user.fullName}</span>
              <button className="icon-button" onClick={logout} title="Logout" type="button">
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <Link className="login-link" to="/login">
              <Shield size={16} /> Login
            </Link>
          )}
        </div>
      </header>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
