import { FormEvent, useEffect, useState } from 'react';
import FeedbackState from '../../components/FeedbackState';
import { getStandings } from '../../services/resourceApi';
import type { StandingRow } from '../../types';
import '../../styles/pages/public/StandingsPage.css';

function StandingsPage() {
  const [tournamentId, setTournamentId] = useState('1');
  const [rows, setRows] = useState<StandingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    load();
  }, []);

  async function load(event?: FormEvent) {
    event?.preventDefault();
    setLoading(true);
    setError('');
    try {
      setRows(await getStandings(tournamentId));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Cannot load standings.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="content-panel standings-page">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Group table</p>
          <h1>Group Standings</h1>
        </div>
        <form className="inline-form" onSubmit={load}>
          <input value={tournamentId} onChange={(event) => setTournamentId(event.target.value)} />
          <button type="submit" disabled={loading}>
            Load
          </button>
        </form>
      </div>
      <FeedbackState loading={loading} error={error} empty={rows.length === 0} emptyMessage="No standings available.">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Group</th>
                <th>Rank</th>
                <th>Team</th>
                <th>P</th>
                <th>W</th>
                <th>D</th>
                <th>L</th>
                <th>GD</th>
                <th>Pts</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className={row.rank <= 2 ? 'top-team' : ''}>
                  <td>{row.group?.name}</td>
                  <td>
                    <span className="rank-badge">{row.rank}</span>
                  </td>
                  <td>{row.team?.name}</td>
                  <td>{row.played}</td>
                  <td>{row.won}</td>
                  <td>{row.drawn}</td>
                  <td>{row.lost}</td>
                  <td>{row.goalDifference}</td>
                  <td className="points-cell">{row.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FeedbackState>
    </section>
  );
}

export default StandingsPage;
