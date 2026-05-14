import { useCallback, useEffect, useMemo, useState } from 'react';
import FeedbackState from '../../components/FeedbackState';
import { useMatchRealtime } from '../../hooks/useMatchRealtime';
import { listResource } from '../../services/resourceApi';
import type { Match } from '../../types';
import '../../styles/pages/public/SchedulePage.css';

function SchedulePage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('ALL');
  const [stage, setStage] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    listResource<Match>('matches')
      .then(setMatches)
      .catch((err: any) => setError(err.response?.data?.message || 'Cannot load match schedule.'))
      .finally(() => setLoading(false));
  }, []);

  const handleMatchUpdated = useCallback((updatedMatch: Match) => {
    setMatches((current) => current.map((match) => (match.id === updatedMatch.id ? updatedMatch : match)));
  }, []);

  useMatchRealtime(handleMatchUpdated);

  const filteredMatches = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return matches.filter((match) => {
      const matchesQuery = [
        match.homeTeam?.name,
        match.homeTeam?.shortName,
        match.awayTeam?.name,
        match.awayTeam?.shortName,
        match.stadium?.name,
        match.round
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedQuery));
      const matchesStatus = status === 'ALL' || match.status === status;
      const matchesStage = stage === 'ALL' || match.stage === stage;
      return matchesQuery && matchesStatus && matchesStage;
    });
  }, [matches, query, status, stage]);

  return (
    <FeedbackState loading={loading} error={error}>
      <section className="content-panel schedule-page">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Fixtures and results</p>
            <h1>Match Schedule</h1>
          </div>
        </div>

        <div className="filter-bar">
          <label>
            <span>Search</span>
            <input value={query} placeholder="Team, stadium, round..." onChange={(event) => setQuery(event.target.value)} />
          </label>
          <label>
            <span>Status</span>
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="ALL">ALL</option>
              <option value="SCHEDULED">SCHEDULED</option>
              <option value="LIVE">LIVE</option>
              <option value="FINISHED">FINISHED</option>
              <option value="CANCELED">CANCELED</option>
            </select>
          </label>
          <label>
            <span>Stage</span>
            <select value={stage} onChange={(event) => setStage(event.target.value)}>
              <option value="ALL">ALL</option>
              <option value="GROUP">GROUP</option>
              <option value="KNOCKOUT">KNOCKOUT</option>
            </select>
          </label>
        </div>

        <FeedbackState empty={filteredMatches.length === 0} emptyMessage="No matches match your filters.">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Match</th>
                  <th>Stadium</th>
                  <th>Status</th>
                  <th>Round</th>
                </tr>
              </thead>
              <tbody>
                {filteredMatches.map((match) => (
                  <tr key={match.id}>
                    <td className="schedule-date">{new Date(match.matchDate).toLocaleString()}</td>
                    <td>
                      <div className="schedule-match-cell">
                        <span className="schedule-team">
                          <span className="team-crest">{match.homeTeam?.shortName || 'TBD'}</span>
                          {match.homeTeam?.name}
                        </span>
                        <span className="schedule-score">
                          {match.homeScore ?? '-'} : {match.awayScore ?? '-'}
                        </span>
                        <span className="schedule-team away">
                          {match.awayTeam?.name}
                          <span className="team-crest">{match.awayTeam?.shortName || 'TBD'}</span>
                        </span>
                      </div>
                    </td>
                    <td className="schedule-stadium">{match.stadium?.name || 'TBD'}</td>
                    <td>
                      <span className={match.status === 'LIVE' ? 'live-badge' : `status-badge ${match.status.toLowerCase()}`}>
                        {match.status}
                      </span>
                    </td>
                    <td>{match.round}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FeedbackState>
      </section>
    </FeedbackState>
  );
}

export default SchedulePage;
