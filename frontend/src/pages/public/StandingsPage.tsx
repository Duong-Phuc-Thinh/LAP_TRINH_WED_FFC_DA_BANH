import { FormEvent, useEffect, useState } from 'react';
import FeedbackState from '../../components/FeedbackState';
import { getStandings, listResource } from '../../services/resourceApi';
import type { StandingRow, Tournament } from '../../types';
import '../../styles/pages/public/StandingsPage.css';

function StandingsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [tournamentId, setTournamentId] = useState('');
  const [rows, setRows] = useState<StandingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    boot();
  }, []);

  async function boot() {
    setLoading(true);
    setError('');
    try {
      const tournamentRows = await listResource<Tournament>('tournaments');
      const activeTournament =
        tournamentRows.find((tournament) => ['ONGOING', 'OPEN'].includes(tournament.status)) || tournamentRows[0];
      setTournaments(tournamentRows);
      if (activeTournament) {
        setTournamentId(String(activeTournament.id));
        setRows(await getStandings(activeTournament.id));
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Cannot load standings.');
    } finally {
      setLoading(false);
    }
  }

  async function load(event?: FormEvent) {
    event?.preventDefault();
    if (!tournamentId) return;
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
          <select value={tournamentId} onChange={(event) => setTournamentId(event.target.value)}>
            {tournaments.map((tournament) => (
              <option key={tournament.id} value={tournament.id}>
                {tournament.name} {tournament.season}
              </option>
            ))}
          </select>
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
