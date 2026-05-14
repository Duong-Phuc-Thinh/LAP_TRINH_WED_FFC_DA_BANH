import { NavLink, Outlet } from 'react-router-dom';
import { CalendarDays, Gauge, Newspaper, Shield, Trophy, Users } from 'lucide-react';
import '../styles/layouts/DashboardLayout.css';

const links = [
  { to: '/dashboard', label: 'Overview', icon: Gauge },
  { to: '/dashboard/users', label: 'Users', icon: Shield },
  { to: '/dashboard/tournaments', label: 'Tournaments', icon: Trophy },
  { to: '/dashboard/groups', label: 'Groups', icon: Trophy },
  { to: '/dashboard/teams', label: 'Teams', icon: Users },
  { to: '/dashboard/players', label: 'Players', icon: Users },
  { to: '/dashboard/stadiums', label: 'Stadiums', icon: CalendarDays },
  { to: '/dashboard/matches', label: 'Matches', icon: CalendarDays },
  { to: '/dashboard/results', label: 'Results', icon: CalendarDays },
  { to: '/dashboard/events', label: 'Events', icon: CalendarDays },
  { to: '/dashboard/standings', label: 'Standings', icon: Trophy },
  { to: '/dashboard/bracket', label: 'Bracket', icon: Trophy },
  { to: '/dashboard/news', label: 'News', icon: Newspaper }
];

function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === '/dashboard'}>
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </aside>
      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;
