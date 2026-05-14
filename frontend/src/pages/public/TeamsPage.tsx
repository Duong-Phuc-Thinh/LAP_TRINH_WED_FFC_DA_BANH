import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import FeedbackState from '../../components/FeedbackState';
import { listResource } from '../../services/resourceApi';
import type { Team } from '../../types';
import '../../styles/pages/public/TeamsPage.css';

function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [query, setQuery] = useState('');
  const [groupName, setGroupName] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    listResource<Team>('teams')
      .then(setTeams)
      .catch((err: any) => setError(err.response?.data?.message || 'Cannot load teams.'))
      .finally(() => setLoading(false));
  }, []);

  const groups = useMemo(
    () => ['ALL', ...Array.from(new Set(teams.map((team) => team.group?.name).filter((name): name is string => Boolean(name))))],
    [teams]
  );

  const filteredTeams = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return teams.filter((team) => {
      const matchesQuery = [team.name, team.shortName, team.coachName, team.countryCode]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedQuery));
      const matchesGroup = groupName === 'ALL' || team.group?.name === groupName;
      return matchesQuery && matchesGroup;
    });
  }, [teams, query, groupName]);

  return (
    <FeedbackState loading={loading} error={error}>
      <section className="content-panel teams-page">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Tournament squads</p>
            <h1>Teams</h1>
          </div>
        </div>

        <div className="filter-bar">
          <label>
            <span>Search team</span>
            <input value={query} placeholder="Vietnam, THA, coach..." onChange={(event) => setQuery(event.target.value)} />
          </label>
          <label>
            <span>Group</span>
            <select value={groupName} onChange={(event) => setGroupName(event.target.value)}>
              {groups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </label>
        </div>

        <FeedbackState empty={filteredTeams.length === 0} emptyMessage="No teams match your filters.">
          <div className="card-grid">
            {filteredTeams.map((team) => (
              <Link className="team-card" key={team.id} to={`/teams/${team.id}`}>
                <div className="team-card-header">
                  <span className="team-crest">
                    {team.logoUrl ? <img src={team.logoUrl} alt="" /> : team.shortName}
                  </span>
                  <div>
                    <strong>{team.name}</strong>
                    <span>{team.shortName}</span>
                  </div>
                </div>
                <small>{team.group?.name || 'No group'}</small>
                <div className="team-card-stats">
                  <div>
                    <span>Coach</span>
                    <small>{team.coachName || 'Updating'}</small>
                  </div>
                  <div>
                    <span>Code</span>
                    <small>{team.countryCode || team.shortName}</small>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </FeedbackState>
      </section>
    </FeedbackState>
  );
}

export default TeamsPage;
