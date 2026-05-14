import { FormEvent, useState } from 'react';
import FeedbackState from '../../components/FeedbackState';
import { getStandings, recalculateGroup } from '../../services/resourceApi';
import type { StandingRow } from '../../types';
import '../../styles/pages/dashboard/StandingAdminPage.css';

function StandingAdminPage() {
  const [form, setForm] = useState({ tournamentId: '1', groupId: '1' });
  const [rows, setRows] = useState<StandingRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function load(event?: FormEvent) {
    event?.preventDefault();
    setLoading(true);
    setError('');
    try {
      setRows(await getStandings(form.tournamentId));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Cannot load standings.');
    } finally {
      setLoading(false);
    }
  }

  async function recalculate() {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      setRows(await recalculateGroup(form.tournamentId, form.groupId));
      setMessage('Standings recalculated successfully.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Cannot recalculate standings.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="dashboard-section standing-admin-page">
      <div className="section-heading">
        <h1>Standing Calculation</h1>
        <form className="inline-form" onSubmit={load}>
          <input value={form.tournamentId} onChange={(event) => setForm({ ...form, tournamentId: event.target.value })} />
          <input value={form.groupId} onChange={(event) => setForm({ ...form, groupId: event.target.value })} />
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Load'}
          </button>
          <button type="button" disabled={loading} onClick={recalculate}>
            {loading ? 'Working...' : 'Recalculate'}
          </button>
        </form>
      </div>
      {error && <p className="form-error">{error}</p>}
      {message && <p className="success-message">{message}</p>}
      <FeedbackState loading={loading} empty={rows.length === 0} emptyMessage="No standings loaded.">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Group</th>
                <th>Rank</th>
                <th>Team</th>
                <th>Played</th>
                <th>GD</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>{row.group?.name}</td>
                  <td>{row.rank}</td>
                  <td>{row.team?.name}</td>
                  <td>{row.played}</td>
                  <td>{row.goalDifference}</td>
                  <td>{row.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FeedbackState>
    </section>
  );
}

export default StandingAdminPage;
