import { FormEvent, useEffect, useState } from 'react';
import FeedbackState from '../../components/FeedbackState';
import { listResource, updateMatchResult } from '../../services/resourceApi';
import type { Match } from '../../types';
import '../../styles/pages/dashboard/ResultUpdatePage.css';

function ResultUpdatePage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [form, setForm] = useState({ matchId: '', homeScore: '0', awayScore: '0', status: 'FINISHED' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    listResource<Match>('matches')
      .then(setMatches)
      .catch((err: any) => setError(err.response?.data?.message || 'Cannot load matches.'))
      .finally(() => setLoading(false));
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setMessage('');
    setError('');

    if (Number(form.homeScore) < 0 || Number(form.awayScore) < 0) {
      setError('Scores must be greater than or equal to 0.');
      return;
    }

    try {
      setSaving(true);
      await updateMatchResult(form.matchId, form);
      setMessage('Result updated and standings recalculated if needed.');
      setMatches(await listResource<Match>('matches'));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Cannot update result.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <FeedbackState loading={loading} error={error && matches.length === 0 ? error : ''}>
      <section className="dashboard-section result-update-page">
        <h1>Result Update</h1>
        <form className="crud-form compact-form" onSubmit={submit}>
          <label>
            <span>Match</span>
            <select value={form.matchId} onChange={(event) => setForm({ ...form, matchId: event.target.value })}>
              <option value="">Select match</option>
              {matches.map((match) => (
                <option key={match.id} value={match.id}>
                  #{match.id} {match.homeTeam?.shortName} vs {match.awayTeam?.shortName}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Home score</span>
            <input type="number" value={form.homeScore} onChange={(event) => setForm({ ...form, homeScore: event.target.value })} />
          </label>
          <label>
            <span>Away score</span>
            <input type="number" value={form.awayScore} onChange={(event) => setForm({ ...form, awayScore: event.target.value })} />
          </label>
          <label>
            <span>Status</span>
            <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
              <option>LIVE</option>
              <option>FINISHED</option>
            </select>
          </label>
          <button type="submit" disabled={!form.matchId || saving}>
            {saving ? 'Saving...' : 'Save result'}
          </button>
        </form>
        {error && matches.length > 0 && <p className="form-error">{error}</p>}
        {message && <p className="success-message">{message}</p>}
      </section>
    </FeedbackState>
  );
}

export default ResultUpdatePage;
