import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, Clock, Medal, Newspaper, Radio, Trophy, Users } from 'lucide-react';
import FeedbackState from '../../components/FeedbackState';
import { useMatchRealtime } from '../../hooks/useMatchRealtime';
import { getStandings, listPublicNews, listResource } from '../../services/resourceApi';
import type { Match, NewsItem, StandingRow, Team } from '../../types';
import '../../styles/pages/public/HomePage.css';

function HomePage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [standings, setStandings] = useState<StandingRow[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadHomeData() {
      setLoading(true);
      setError('');

      try {
        const [matchRows, teamRows, newsRows] = await Promise.all([
          listResource<Match>('matches'),
          listResource<Team>('teams'),
          listPublicNews()
        ]);

        if (!mounted) return;

        setMatches([...matchRows].sort(sortByDate));
        setTeams(teamRows);
        setNews(newsRows.slice(0, 3));

        const tournamentId = matchRows.find((match) => match.tournamentId)?.tournamentId || teamRows.find((team) => team.tournamentId)?.tournamentId;
        if (tournamentId) {
          try {
            const standingRows = await getStandings(tournamentId);
            if (mounted) setStandings(standingRows);
          } catch {
            if (mounted) setStandings([]);
          }
        }
      } catch (err: any) {
        if (mounted) setError(err.response?.data?.message || 'Cannot load tournament overview.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadHomeData();

    return () => {
      mounted = false;
    };
  }, []);

  const handleMatchUpdated = useCallback((updatedMatch: Match) => {
    setMatches((current) => upsertMatch(current, updatedMatch));
  }, []);

  useMatchRealtime(handleMatchUpdated);

  const liveMatches = useMemo(() => matches.filter((match) => match.status === 'LIVE'), [matches]);
  const upcomingMatches = useMemo(
    () => matches.filter((match) => ['LIVE', 'SCHEDULED'].includes(match.status)).slice(0, 4),
    [matches]
  );
  const recentResults = useMemo(
    () => [...matches].filter((match) => match.status === 'FINISHED').sort(sortByDateDesc).slice(0, 3),
    [matches]
  );
  const featuredMatch = liveMatches[0] || upcomingMatches[0] || recentResults[0] || matches[0];
  const schedulePreview = upcomingMatches.length > 0 ? upcomingMatches : matches.slice(0, 4);
  const groupTables = useMemo(() => buildGroupTables(standings), [standings]);
  const showcaseTeams = useMemo(() => teams.slice(0, 8), [teams]);

  return (
    <FeedbackState loading={loading} error={error}>
      <section className="home-page tournament-home">
        <section className="home-hero-world">
          <span className="stadium-light stadium-light-left" />
          <span className="stadium-light stadium-light-center" />
          <span className="stadium-light stadium-light-right" />
          <span className="stadium-tier stadium-tier-one" />
          <span className="stadium-tier stadium-tier-two" />

          <div className="hero-world-copy">
            <p className="hero-kicker">ASEAN Championship Match Center</p>
            <h1>AFF Cup 2026</h1>
            <p className="hero-slogan">Where nations rise under the floodlights.</p>

            <div className="hero-actions">
              <Link className="home-cta primary shine-link" to="/matches">
                View fixtures
                <ArrowRight size={18} />
              </Link>
              <Link className="home-cta secondary" to="/standings">
                Group tables
              </Link>
            </div>

            <div className="hero-metrics">
              <HeroMetric icon={Radio} label="Live matches" value={liveMatches.length} />
              <HeroMetric icon={Users} label="Teams" value={teams.length} />
              <HeroMetric icon={Newspaper} label="Stories" value={news.length} />
            </div>
          </div>

          <div className="hero-trophy-stage" aria-hidden="true">
            <div className="trophy-glow-ring" />
            <Trophy className="hero-trophy" size={116} strokeWidth={1.4} />
            <span className="floating-football-glow" />
          </div>
        </section>

        {featuredMatch && (
          <section className="featured-match-section fade-section">
            <div className="home-section-heading">
              <div>
                <p className="section-kicker">Featured match</p>
                <h2>Matchday spotlight</h2>
              </div>
              <Link className="section-link" to="/results">
                Results
                <ArrowRight size={16} />
              </Link>
            </div>
            <FeaturedMatchCard match={featuredMatch} />
          </section>
        )}

        <section className="home-section home-schedule-section fade-section">
          <div className="home-section-heading">
            <div>
              <p className="section-kicker">Tournament calendar</p>
              <h2>Upcoming fixtures</h2>
            </div>
            <Link className="section-link" to="/matches">
              Full schedule
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="fixture-grid">
            {schedulePreview.map((match) => (
              <MatchStrip key={match.id} match={match} />
            ))}
          </div>
        </section>

        <section className="home-split-section fade-section">
          <div className="home-section standings-preview-section">
            <div className="home-section-heading compact">
              <div>
                <p className="section-kicker">Fast table</p>
                <h2>Group standings</h2>
              </div>
              <Link className="section-link" to="/standings">
                View all
              </Link>
            </div>

            {groupTables.length > 0 ? (
              <div className="standings-preview-list">
                {groupTables.map(([groupName, rows]) => (
                  <article className="standings-card lift-card" key={groupName}>
                    <h3>{groupName}</h3>
                    <div className="standing-rows">
                      {rows.map((row) => (
                        <div className="standing-row" key={row.id}>
                          <span className="rank-chip">{row.rank}</span>
                          <span>{row.team?.shortName || row.team?.name || 'TBD'}</span>
                          <strong>{row.points}</strong>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="home-empty-note">Standings will appear after group matches are recalculated.</p>
            )}
          </div>

          <div className="home-section results-preview-section">
            <div className="home-section-heading compact">
              <div>
                <p className="section-kicker">Latest scores</p>
                <h2>Results</h2>
              </div>
              <Link className="section-link" to="/results">
                All results
              </Link>
            </div>

            <div className="result-preview-list">
              {recentResults.map((match) => (
                <article className="result-preview-card lift-card" key={match.id}>
                  <span>{formatRound(match.round)}</span>
                  <strong>
                    {match.homeTeam?.shortName || 'TBD'} {match.homeScore ?? '-'} : {match.awayScore ?? '-'}{' '}
                    {match.awayTeam?.shortName || 'TBD'}
                  </strong>
                  <small>{match.winnerTeam?.shortName ? `${match.winnerTeam.shortName} win` : 'Draw or pending'}</small>
                </article>
              ))}
              {recentResults.length === 0 && <p className="home-empty-note">No final scores yet.</p>}
            </div>
          </div>
        </section>

        <section className="home-section teams-showcase-section fade-section">
          <div className="home-section-heading">
            <div>
              <p className="section-kicker">Nations on stage</p>
              <h2>Teams showcase</h2>
            </div>
            <Link className="section-link" to="/teams">
              Explore teams
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="team-showcase-grid">
            {showcaseTeams.map((team) => (
              <Link className="team-showcase-card lift-card" key={team.id} to={`/teams/${team.id}`}>
                <span className="team-showcase-crest">
                  {team.logoUrl ? <img src={team.logoUrl} alt="" /> : team.shortName}
                </span>
                <strong>{team.shortName}</strong>
                <small>{team.group?.name || team.name}</small>
              </Link>
            ))}
          </div>
        </section>

        <section className="home-section news-showcase-section fade-section">
          <div className="home-section-heading">
            <div>
              <p className="section-kicker">Tournament news</p>
              <h2>Latest stories</h2>
            </div>
            <Link className="section-link" to="/news">
              Newsroom
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="news-showcase-grid">
            {news.map((item, index) => (
              <article className={`news-showcase-card lift-card${index === 0 ? ' lead-story' : ''}`} key={item.id}>
                <span>{item.type}</span>
                <h3>{item.title}</h3>
                <p>{item.content}</p>
                <small>{item.publishedAt ? formatDate(item.publishedAt) : 'Latest update'}</small>
              </article>
            ))}
          </div>
        </section>

        <section className="home-footer-cta fade-section">
          <div>
            <p className="section-kicker">Every match. Every table. Every story.</p>
            <h2>Follow the road to the AFF Cup final.</h2>
          </div>
          <Link className="home-cta primary shine-link" to="/matches">
            Enter match center
            <ArrowRight size={18} />
          </Link>
        </section>
      </section>
    </FeedbackState>
  );
}

function HeroMetric({ icon: Icon, label, value }: { icon: typeof Trophy; label: string; value: number | string }) {
  return (
    <div className="hero-metric">
      <Icon size={18} />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function FeaturedMatchCard({ match }: { match: Match }) {
  return (
    <article className="featured-match-card lift-card">
      <div className="featured-match-meta">
        <span className={match.status === 'LIVE' ? 'live-badge' : `status-badge ${match.status.toLowerCase()}`}>
          {match.status}
        </span>
        <span>{formatRound(match.round)}</span>
      </div>

      <div className="featured-scoreboard">
        <TeamBlock team={match.homeTeam} fallback="Home" />
        <div className="featured-score">
          <strong>
            {match.homeScore ?? '-'} : {match.awayScore ?? '-'}
          </strong>
          <span>{match.status === 'FINISHED' ? match.winnerTeam?.shortName || 'Final score' : 'Kickoff approaching'}</span>
        </div>
        <TeamBlock team={match.awayTeam} fallback="Away" />
      </div>

      <div className="featured-match-footer">
        <span>
          <Clock size={15} />
          {formatDate(match.matchDate)}
        </span>
        <span>
          <Medal size={15} />
          {match.stadium?.name || 'Stadium TBC'}
        </span>
      </div>
    </article>
  );
}

function MatchStrip({ match }: { match: Match }) {
  return (
    <article className="fixture-card lift-card">
      <div className="fixture-date">
        <CalendarDays size={18} />
        <span>{formatDate(match.matchDate)}</span>
      </div>
      <div className="fixture-teams">
        <strong>{match.homeTeam?.shortName || 'TBD'}</strong>
        <span>{match.homeScore ?? '-'} : {match.awayScore ?? '-'}</span>
        <strong>{match.awayTeam?.shortName || 'TBD'}</strong>
      </div>
      <div className="fixture-meta">
        <span className={match.status === 'LIVE' ? 'live-badge' : `status-badge ${match.status.toLowerCase()}`}>
          {match.status}
        </span>
        <small>{formatRound(match.round)}</small>
      </div>
    </article>
  );
}

function TeamBlock({ team, fallback }: { team?: Match['homeTeam']; fallback: string }) {
  return (
    <div className="featured-team-block">
      <span className="featured-team-crest">{team?.shortName || 'TBD'}</span>
      <strong>{team?.name || fallback}</strong>
    </div>
  );
}

function buildGroupTables(rows: StandingRow[]) {
  const groups = new Map<string, StandingRow[]>();

  rows.forEach((row) => {
    const groupName = row.group?.name || 'Group';
    const current = groups.get(groupName) || [];
    current.push(row);
    groups.set(groupName, current);
  });

  return Array.from(groups.entries())
    .map(([groupName, groupRows]) => [groupName, groupRows.sort((a, b) => a.rank - b.rank).slice(0, 4)] as [string, StandingRow[]])
    .slice(0, 2);
}

function upsertMatch(matches: Match[], updatedMatch: Match) {
  const exists = matches.some((match) => match.id === updatedMatch.id);
  if (!exists) return [updatedMatch, ...matches].sort(sortByDate);
  return matches.map((match) => (match.id === updatedMatch.id ? updatedMatch : match)).sort(sortByDate);
}

function sortByDate(a: Match, b: Match) {
  return new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime();
}

function sortByDateDesc(a: Match, b: Match) {
  return new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime();
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value));
}

function formatRound(round: string) {
  return round.replace(/_/g, ' ');
}

export default HomePage;
