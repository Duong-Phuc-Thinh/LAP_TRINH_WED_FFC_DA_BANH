import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Newspaper, Trophy, Users } from 'lucide-react';
import FeedbackState from '../../components/FeedbackState';
import StatCard from '../../components/StatCard';
import { listResource } from '../../services/resourceApi';
import type { Match, NewsItem, Team } from '../../types';
import '../../styles/pages/public/HomePage.css';

function HomePage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([listResource<Match>('matches'), listResource<Team>('teams'), listResource<NewsItem>('news')])
      .then(([matchRows, teamRows, newsRows]) => {
        setMatches(matchRows.slice(0, 5));
        setTeams(teamRows);
        setNews(newsRows.slice(0, 3));
      })
      .catch((err: any) => setError(err.response?.data?.message || 'Cannot load tournament overview.'))
      .finally(() => setLoading(false));
  }, []);

  const featuredMatch = matches.find((match) => match.status === 'LIVE') || matches[0];
  const liveCount = matches.filter((match) => match.status === 'LIVE').length;

  return (
    <FeedbackState loading={loading} error={error}>
      <section className="home-page">
      <section className="home-hero">
        <div className="home-hero-content">
          <p className="hero-eyebrow">Live football tournament platform</p>
          <h1>AFF Cup Match Center</h1>
          <p>Follow fixtures, scores, tables, knockout brackets and tournament news in a cinematic matchday experience.</p>
          <div className="hero-actions">
            <Link className="hero-action" to="/matches">
              View matches
            </Link>
            <Link className="hero-action secondary" to="/standings">
              Group standings
            </Link>
          </div>
        </div>

        {featuredMatch && (
          <div className="hero-scoreboard">
            <MatchCard match={featuredMatch} featured />
          </div>
        )}
      </section>

      <div className="stat-grid">
        <StatCard label="Live" value={liveCount} icon={CalendarDays} />
        <StatCard label="Teams" value={teams.length} icon={Users} />
        <StatCard label="Stories" value={news.length} icon={Newspaper} />
        <StatCard label="Knockout" value={1} icon={Trophy} />
      </div>

      <section className="content-panel featured-section">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Featured fixtures</p>
            <h2>Matchday scoreboard</h2>
          </div>
          <Link className="ghost-button hero-action secondary" to="/matches">
            Full schedule
          </Link>
        </div>
        <div className="match-list">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </section>
      </section>
    </FeedbackState>
  );
}

function MatchCard({ match, featured = false }: { match: Match; featured?: boolean }) {
  const homeScore = match.homeScore ?? '-';
  const awayScore = match.awayScore ?? '-';

  return (
    <article className={`football-match-card${featured ? ' featured-match-card' : ''}`}>
      <div className="match-card-top">
        <span className={match.status === 'LIVE' ? 'live-badge' : `status-badge ${match.status.toLowerCase()}`}>
          {match.status}
        </span>
        <span className="match-card-stage">{match.round}</span>
      </div>

      <div className="scoreboard">
        <div className="scoreboard-team">
          <span className="team-crest">{match.homeTeam?.shortName || 'TBD'}</span>
          <span className="team-name">{match.homeTeam?.name || 'Home team'}</span>
        </div>

        <div className="score-center">
          <span className="score-value">
            {homeScore} : {awayScore}
          </span>
          <span className="score-label">Score</span>
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
  );
}

export default HomePage;
