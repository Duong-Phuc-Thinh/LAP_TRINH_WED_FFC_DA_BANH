import { FormEvent, useState } from 'react';
import FeedbackState from '../../components/FeedbackState';
import { generateSemiFinals, getBracket } from '../../services/resourceApi';
import '../../styles/pages/dashboard/BracketPage.css';

function BracketPage() {
  const [tournamentId, setTournamentId] = useState('1');
  const [form, setForm] = useState({ matchDate1: '', matchDate2: '', stadiumId1: '', stadiumId2: '' });
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function load(event?: FormEvent) {
    event?.preventDefault();
    setLoading(true);
    setError('');
    try {
      setMatches(await getBracket(tournamentId));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Cannot load bracket.');
    } finally {
      setLoading(false);
    }
  }

  async function generate(event: FormEvent) {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!form.matchDate1 || !form.matchDate2) {
      setError('Both semifinal dates are required.');
      return;
    }

    try {
      setSaving(true);
      await generateSemiFinals(tournamentId, form);
      setMessage('Semifinals generated successfully.');
      await load();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Cannot generate semifinals.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="dashboard-section bracket-page">
      <div className="section-heading">
        <h1>Knockout Bracket</h1>
        <form className="inline-form" onSubmit={load}>
          <input value={tournamentId} onChange={(event) => setTournamentId(event.target.value)} />
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Load'}
          </button>
        </form>
      </div>

      <form className="crud-form compact-form" onSubmit={generate}>
        <label>
          <span>Semifinal 1 date</span>
          <input type="datetime-local" value={form.matchDate1} onChange={(event) => setForm({ ...form, matchDate1: event.target.value })} />
        </label>
        <label>
          <span>Semifinal 2 date</span>
          <input type="datetime-local" value={form.matchDate2} onChange={(event) => setForm({ ...form, matchDate2: event.target.value })} />
        </label>
        <label>
          <span>Stadium 1 ID</span>
          <input value={form.stadiumId1} onChange={(event) => setForm({ ...form, stadiumId1: event.target.value })} />
        </label>
        <label>
          <span>Stadium 2 ID</span>
          <input value={form.stadiumId2} onChange={(event) => setForm({ ...form, stadiumId2: event.target.value })} />
        </label>
        <button type="submit" disabled={saving}>
          {saving ? 'Generating...' : 'Generate semifinals'}
        </button>
      </form>

      {error && <p className="form-error">{error}</p>}
      {message && <p className="success-message">{message}</p>}

      <FeedbackState loading={loading} empty={matches.length === 0} emptyMessage="No knockout matches loaded.">
        <div className="bracket-list">
          {matches.map((match) => (
            <article key={match.id} className="match-row">
              <strong>{match.round}</strong>
              <span>
                {match.homeTeam?.shortName} vs {match.awayTeam?.shortName}
              </span>
              <small>{match.winnerTeam?.shortName || 'No winner yet'}</small>
            </article>
          ))}
        </div>
      </FeedbackState>
    </section>
  );
}

export default BracketPage;
