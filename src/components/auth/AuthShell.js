import { useState } from 'react';
import { gradeOptions } from '../../data/curriculum';
import { avatarOptions } from '../../utils/avatars';

function AuthShell({ onLogin, onRegister }) {
  const [view, setView] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [grade, setGrade] = useState(gradeOptions[0]);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    try {
      await onLogin({ email, password });
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.message ?? 'Nuk u arrit të hyhet në sistem.');
    }
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Fjalëkalimi dhe konfirmimi duhet të përputhen.');
      return;
    }

    try {
      await onRegister({
        name,
        email,
        password,
        grade,
        avatarId: avatarOptions[0].id,
      });
      setSuccess('Llogaria u krijua! Po kyçesh automatikisht.');
      setView('login');
    } catch (err) {
      setError(err.message ?? 'Krijimi i llogarisë dështoi.');
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-brand">
        <div className="brand-mark">⭐️</div>
        <h1>Kosovo Learn</h1>
        <p>Platformë e personalizuar për nxënësit e klasës 5-9.</p>
      </div>

      <div className="auth-switcher">
        <button
          type="button"
          className={`auth-tab ${view === 'login' ? 'auth-tab-active' : ''}`}
          onClick={() => {
            setView('login');
            setError('');
            setSuccess('');
          }}
        >
          Hyr
        </button>
        <button
          type="button"
          className={`auth-tab ${view === 'register' ? 'auth-tab-active' : ''}`}
          onClick={() => {
            setView('register');
            setError('');
            setSuccess('');
          }}
        >
          Regjistrohu
        </button>
      </div>

      {view === 'login' ? (
        <form className="auth-form" onSubmit={handleLoginSubmit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label>
            Fjalëkalimi
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          <button type="submit">Hyr</button>
          {error && <p className="auth-error">{error}</p>}
          <div className="auth-hint">
            Për provë: <strong>nxenesi@example.com / sekreti123</strong> ose{' '}
            <strong>admin@kosovolearn.com / admin123</strong>
          </div>
        </form>
      ) : (
        <form className="auth-form" onSubmit={handleRegisterSubmit}>
          <label>
            Emri dhe mbiemri
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label>
            Klasa
            <select value={grade} onChange={(event) => setGrade(event.target.value)}>
              {gradeOptions.map((option) => (
                <option key={option} value={option}>
                  Klasa {option}
                </option>
              ))}
            </select>
          </label>
          <label>
            Fjalëkalimi
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          <label>
            Konfirmo fjalëkalimin
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </label>
          <button type="submit">Krijo llogari</button>
          {error && <p className="auth-error">{error}</p>}
          {success && <p className="auth-success">{success}</p>}
        </form>
      )}
    </div>
  );
}

export default AuthShell;
