import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/pages/auth/AuthPages.css';

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');

    try {
      await register(form);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Register failed');
    }
  }

  return (
    <section className="auth-page register-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Register</h1>
        {Object.keys(form).map((key) => (
          <label key={key}>
            <span>{key}</span>
            <input
              type={key === 'password' ? 'password' : 'text'}
              value={form[key as keyof typeof form]}
              onChange={(event) => setForm({ ...form, [key]: event.target.value })}
            />
          </label>
        ))}
        <button type="submit">Create account</button>
        {error && <p className="form-error">{error}</p>}
      </form>
    </section>
  );
}

export default RegisterPage;
