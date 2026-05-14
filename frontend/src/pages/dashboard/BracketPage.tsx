import { FormEvent, useState } from 'react';
import FeedbackState from '../../components/FeedbackState';
import { generateFinal, generateSemiFinals, getBracket } from '../../services/resourceApi';
import type { Match } from '../../types';
import '../../styles/pages/dashboard/BracketPage.css';

function BracketPage() {
  const [tournamentId, setTournamentId] = useState('1');
  const [semiForm, setSemiForm] = useState({ matchDate1: '', matchDate2: '', stadiumId1: '', stadiumId2: '' });
  const [finalForm, setFinalForm] = useState({ matchDate: '', stadiumId: '' });
  const [matches, setMatches] = useState<Match[]>([]);
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

    if (!semiForm.matchDate1 || !semiForm.matchDate2) {
      setError('Both semifinal dates are required.');
      return;
    }

    try {
      setSaving(true);
      await generateSemiFinals(tournamentId, semiForm);
      setMessage('Semifinals generated successfully.');
      await load();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Cannot generate semifinals.');
    } finally {
      setSaving(false);
    }
  }

  async function generateFinalMatch(event: FormEvent) {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!finalForm.matchDate) {
      setError('Final date is required.');
      return;
    }

    try {
      setSaving(true);
      await generateFinal(tournamentId, finalForm);
      setMessage('Final generated from semifinal winners.');
      await load();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Cannot generate final.');
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
          <input
            type="datetime-local"
            value={semiForm.matchDate1}
            onChange={(event) => setSemiForm({ ...semiForm, matchDate1: event.target.value })}
          />
        </label>
        <label>
          <span>Semifinal 2 date</span>
          <input
            type="datetime-local"
            value={semiForm.matchDate2}
            onChange={(event) => setSemiForm({ ...semiForm, matchDate2: event.target.value })}
          />
        </label>
        <label>
          <span>Stadium 1 ID</span>
          <input value={semiForm.stadiumId1} onChange={(event) => setSemiForm({ ...semiForm, stadiumId1: event.target.value })} />
        </label>
        <label>
          <span>Stadium 2 ID</span>
          <input value={semiForm.stadiumId2} onChange={(event) => setSemiForm({ ...semiForm, stadiumId2: event.target.value })} />
        </label>
        <button type="submit" disabled={saving}>
          {saving ? 'Generating...' : 'Generate semifinals'}
        </button>
      </form>

      <form className="crud-form compact-form" onSubmit={generateFinalMatch}>
        <label>
          <span>Final date</span>
          <input
            type="datetime-local"
            value={finalForm.matchDate}
            onChange={(event) => setFinalForm({ ...finalForm, matchDate: event.target.value })}
          />
        </label>
        <label>
          <span>Final stadium ID</span>
          <input value={finalForm.stadiumId} onChange={(event) => setFinalForm({ ...finalForm, stadiumId: event.target.value })} />
        </label>
        <button type="submit" disabled={saving}>
          {saving ? 'Generating...' : 'Generate final'}
        </button>
      </form>

      {error && <p className="form-error">{error}</p>}
      {message && <p className="success-message">{message}</p>}

      <FeedbackState loading={loading} empty={matches.length === 0} emptyMessage="No knockout matches loaded.">
        <div className="bracket-list">
          {matches.map((match) => (
            <article key={match.id} className="match-row">
              <strong>
                {match.round} - {match.status}
              </strong>
              <span>
                {match.homeTeam?.shortName} {match.homeScore ?? '-'} : {match.awayScore ?? '-'} {match.awayTeam?.shortName}
              </span>
              <small>
                {new Date(match.matchDate).toLocaleString()} - {match.stadium?.name || 'Stadium TBC'} - Winner:{' '}
                {match.winnerTeam?.shortName || 'No winner yet'}
              </small>
            </article>
          ))}
        </div>
      </FeedbackState>
    </section>
  );
}

export default BracketPage;
