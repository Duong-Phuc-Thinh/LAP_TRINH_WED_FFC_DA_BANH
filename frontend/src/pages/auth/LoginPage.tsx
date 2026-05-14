import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import type { Role } from '../../types';
import '../../styles/pages/auth/AuthPages.css';

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('admin@aff.local');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Email is invalid.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      const user = await login(email, password);
      const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;
      navigate(resolveRedirectPath(user.roles, from), { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-page login-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Login</h1>
        <label>
          <span>Email</span>
          <input value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label>
          <span>Password</span>
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </button>
        {error && <p className="form-error">{error}</p>}
        <Link to="/register">Create USER account</Link>
      </form>
    </section>
  );
}

function resolveRedirectPath(roles: Role[], from?: string) {
  const canUseDashboard = roles.some((role) => ['ADMIN', 'ORGANIZER', 'REFEREE'].includes(role));
  const defaultPath = roles.includes('REFEREE') && !roles.some((role) => ['ADMIN', 'ORGANIZER'].includes(role))
    ? '/dashboard/results'
    : canUseDashboard
      ? '/dashboard'
      : '/';

  if (!from || from === '/login') return defaultPath;
  if (from.startsWith('/dashboard') && !canUseDashboard) return '/';
  return from;
}

export default LoginPage;
