import { useEffect, useState } from 'react';
import { CalendarDays, Newspaper, Trophy, Users } from 'lucide-react';
import FeedbackState from '../../components/FeedbackState';
import StatCard from '../../components/StatCard';
import { getDashboardSummary } from '../../services/resourceApi';
import '../../styles/pages/dashboard/DashboardHomePage.css';

function DashboardHomePage() {
  const [summary, setSummary] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getDashboardSummary()
      .then(setSummary)
      .catch((err: any) => setError(err.response?.data?.message || 'Cannot load dashboard summary.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <FeedbackState loading={loading} error={error}>
      <section className="dashboard-section dashboard-home-page">
        <h1>Dashboard</h1>
        <div className="stat-grid">
          <StatCard label="Users" value={summary.users || 0} icon={Users} />
          <StatCard label="Tournaments" value={summary.tournaments || 0} icon={Trophy} />
          <StatCard label="Matches" value={summary.matches || 0} icon={CalendarDays} />
          <StatCard label="News" value={summary.news || 0} icon={Newspaper} />
        </div>
      </section>
    </FeedbackState>
  );
}

export default DashboardHomePage;
