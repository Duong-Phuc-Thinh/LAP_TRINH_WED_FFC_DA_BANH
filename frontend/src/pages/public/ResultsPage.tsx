import { useCallback, useEffect, useMemo, useState } from 'react';
import FeedbackState from '../../components/FeedbackState';
import { useMatchRealtime } from '../../hooks/useMatchRealtime';
import { listResource } from '../../services/resourceApi';
import type { Match } from '../../types';
import '../../styles/pages/public/ResultsPage.css';

function ResultsPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [query, setQuery] = useState('');
  const [round, setRound] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    listResource<Match>('matches')
      .then(setMatches)
      .catch((err: any) => setError(err.response?.data?.message || 'Cannot load match results.'))
      .finally(() => setLoading(false));
  }, []);

  const handleMatchUpdated = useCallback((updatedMatch: Match) => {
    setMatches((current) => current.map((match) => (match.id === updatedMatch.id ? updatedMatch : match)));
  }, []);

  useMatchRealtime(handleMatchUpdated);

  const rounds = useMemo(
    () => ['ALL', ...Array.from(new Set(matches.filter((match) => match.status === 'FINISHED').map((match) => match.round)))],
    [matches]
  );

  const finishedMatches = useMemo(() => {
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

      return match.status === 'FINISHED' && matchesQuery && (round === 'ALL' || match.round === round);
    });
  }, [matches, query, round]);

  return (
    <FeedbackState loading={loading} error={error}>
      <section className="content-panel results-page">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Final scores</p>
            <h1>Match Results</h1>
          </div>
        </div>

        <div className="filter-bar">
          <label>
            <span>Search result</span>
            <input value={query} placeholder="Team, stadium, round..." onChange={(event) => setQuery(event.target.value)} />
          </label>
          <label>
            <span>Round</span>
            <select value={round} onChange={(event) => setRound(event.target.value)}>
              {rounds.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>

        <FeedbackState empty={finishedMatches.length === 0} emptyMessage="No finished matches match your filters.">
          <div className="result-grid">
            {finishedMatches.map((match) => (
              <article className="football-match-card result-card" key={match.id}>
                <div className="match-card-top">
                  <span className="status-badge finished">FINISHED</span>
                  <span className="match-card-stage">{match.round}</span>
                </div>

                <div className="scoreboard">
                  <div className="scoreboard-team">
                    <span className="team-crest">{match.homeTeam?.shortName || 'TBD'}</span>
                    <span className="team-name">{match.homeTeam?.name || 'Home team'}</span>
                  </div>
                  <div className="score-center">
                    <span className="score-value">
                      {match.homeScore ?? '-'} : {match.awayScore ?? '-'}
                    </span>
                    <span className="score-label">{winnerLabel(match)}</span>
                  </div>
                  <div className="scoreboard-team">
                    <span className="team-crest">{match.awayTeam?.shortName || 'TBD'}</span>
                    <span className="team-name">{match.awayTeam?.name || 'Away team'}</span>
                  </div>
                </div>

                <div className="match-card-bottom">
                  <span className="match-card-time">{new Date(match.matchDate).toLocaleString()}</span>
                  <span className="match-card-time">{match.stadium?.name || 'Stadium TBC'}</span>
                </div>
              </article>
            ))}
          </div>
        </FeedbackState>
      </section>
    </FeedbackState>
  );
}

function winnerLabel(match: Match) {
  if (match.homeScore === match.awayScore) return 'DRAW';
  return match.winnerTeam?.shortName ? `${match.winnerTeam.shortName} WINS` : 'WINNER';
}

export default ResultsPage;
