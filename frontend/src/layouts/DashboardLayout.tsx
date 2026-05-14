import { NavLink, Outlet } from 'react-router-dom';
import { CalendarDays, Gauge, Newspaper, Shield, Trophy, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { Role } from '../types';
import '../styles/layouts/DashboardLayout.css';

const links = [
  { to: '/dashboard', label: 'Overview', icon: Gauge, roles: ['ADMIN', 'ORGANIZER'] },
  { to: '/dashboard/users', label: 'Users', icon: Shield, roles: ['ADMIN'] },
  { to: '/dashboard/tournaments', label: 'Tournaments', icon: Trophy, roles: ['ADMIN', 'ORGANIZER'] },
  { to: '/dashboard/groups', label: 'Groups', icon: Trophy, roles: ['ADMIN', 'ORGANIZER'] },
  { to: '/dashboard/teams', label: 'Teams', icon: Users, roles: ['ADMIN', 'ORGANIZER'] },
  { to: '/dashboard/players', label: 'Players', icon: Users, roles: ['ADMIN', 'ORGANIZER'] },
  { to: '/dashboard/stadiums', label: 'Stadiums', icon: CalendarDays, roles: ['ADMIN', 'ORGANIZER'] },
  { to: '/dashboard/matches', label: 'Matches', icon: CalendarDays, roles: ['ADMIN', 'ORGANIZER'] },
  { to: '/dashboard/results', label: 'Results', icon: CalendarDays, roles: ['ADMIN', 'REFEREE'] },
  { to: '/dashboard/events', label: 'Events', icon: CalendarDays, roles: ['ADMIN', 'REFEREE'] },
  { to: '/dashboard/standings', label: 'Standings', icon: Trophy, roles: ['ADMIN', 'ORGANIZER'] },
  { to: '/dashboard/bracket', label: 'Bracket', icon: Trophy, roles: ['ADMIN', 'ORGANIZER'] },
  { to: '/dashboard/news', label: 'News', icon: Newspaper, roles: ['ADMIN', 'ORGANIZER'] }
] satisfies Array<{ to: string; label: string; icon: typeof Gauge; roles: Role[] }>;

function DashboardLayout() {
  const { hasRole } = useAuth();
  const visibleLinks = links.filter((link) => hasRole(link.roles));

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        {visibleLinks.map(({ to, label, icon: Icon }) => (
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
