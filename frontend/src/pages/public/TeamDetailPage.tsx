import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import FeedbackState from '../../components/FeedbackState';
import { getResource, getStandings, listResource } from '../../services/resourceApi';
import type { Match, Player, StandingRow, Team } from '../../types';
import '../../styles/pages/public/TeamDetailPage.css';

function TeamDetailPage() {
  const { id } = useParams();
  const teamId = Number(id);
  const [team, setTeam] = useState<Team | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [standings, setStandings] = useState<StandingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!teamId) {
      setError('Invalid team id.');
      setLoading(false);
      return;
    }

    Promise.all([getResource<Team>('teams', teamId), listResource<Player>('players'), listResource<Match>('matches')])
      .then(async ([teamRow, playerRows, matchRows]) => {
        const standingRows = teamRow.tournamentId ? await getStandings(teamRow.tournamentId) : [];
        setTeam(teamRow);
        setPlayers(playerRows.filter((player) => player.teamId === teamId));
        setMatches(matchRows.filter((match) => match.homeTeam?.id === teamId || match.awayTeam?.id === teamId));
        setStandings(standingRows);
      })
      .catch((err: any) => setError(err.response?.data?.message || 'Cannot load team detail.'))
      .finally(() => setLoading(false));
  }, [teamId]);

  const standing = useMemo(() => standings.find((row) => row.teamId === teamId), [standings, teamId]);
  const finishedMatches = matches.filter((match) => match.status === 'FINISHED').length;

  return (
    <FeedbackState loading={loading} error={error} empty={!team} emptyMessage="Team not found.">
      {team && (
        <section className="team-detail-page">
          <Link className="ghost-button team-back-link" to="/teams">
            Back to teams
          </Link>

          <section className="team-detail-hero">
            <div className="team-detail-identity">
              <span className="team-crest team-detail-crest">
                {team.logoUrl ? <img src={team.logoUrl} alt="" /> : team.shortName}
              </span>
              <div>
                <p className="section-kicker">{team.group?.name || 'AFF Cup squad'}</p>
                <h1>{team.name}</h1>
                <p>{team.coachName || 'Coach information is updating.'}</p>
              </div>
            </div>

            <div className="team-detail-stats">
              <div>
                <span>Rank</span>
                <strong>{standing?.rank || '-'}</strong>
              </div>
              <div>
                <span>Points</span>
                <strong>{standing?.points ?? '-'}</strong>
              </div>
              <div>
                <span>Played</span>
                <strong>{standing?.played ?? finishedMatches}</strong>
              </div>
              <div>
                <span>Players</span>
                <strong>{players.length}</strong>
              </div>
            </div>
          </section>

          <section className="content-panel">
            <div className="section-heading">
              <div>
                <p className="section-kicker">Squad list</p>
                <h2>Players</h2>
              </div>
            </div>
            <div className="player-grid">
              {players.map((player) => (
                <article className="player-card" key={player.id}>
                  <span className="shirt-number">#{player.shirtNumber || '-'}</span>
                  <strong>{player.fullName}</strong>
                  <small>{player.position}</small>
                </article>
              ))}
            </div>
          </section>

          <section className="content-panel">
            <div className="section-heading">
              <div>
                <p className="section-kicker">Fixtures and results</p>
                <h2>Team matches</h2>
              </div>
            </div>
            <div className="match-list">
              {matches.map((match) => (
                <article className="match-row" key={match.id}>
                  <strong>
                    {match.homeTeam?.shortName} {match.homeScore ?? '-'} : {match.awayScore ?? '-'} {match.awayTeam?.shortName}
                  </strong>
                  <span>{new Date(match.matchDate).toLocaleString()}</span>
                  <small>{match.status}</small>
                </article>
              ))}
            </div>
          </section>
        </section>
      )}
    </FeedbackState>
  );
}

export default TeamDetailPage;
