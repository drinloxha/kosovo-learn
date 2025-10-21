import { useState } from 'react';
import { gradeOptions } from '../../data/curriculum';
import { avatarOptions } from '../../utils/avatars';

function StudentSetupModal({ onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [grade, setGrade] = useState(gradeOptions[0]);
  const [avatarId, setAvatarId] = useState(avatarOptions[0].id);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Fjalëkalimi duhet të përputhet me konfirmimin.');
      return;
    }

    if (password.length < 6) {
      setError('Fjalëkalimi duhet të ketë të paktën 6 karaktere.');
      return;
    }

    try {
      onSubmit({ name, email, grade, avatarId, password });
      setName('');
      setEmail('');
      setGrade(gradeOptions[0]);
      setAvatarId(avatarOptions[0].id);
      setPassword('');
      setConfirmPassword('');
      onClose();
    } catch (err) {
      setError(err.message ?? 'Nuk u arrit të krijohet nxënësi.');
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <header>
          <h2>Shto nxënës të ri</h2>
          <p>Plotëso të dhënat dhe cakto fjalëkalimin fillestar.</p>
        </header>
        <form className="modal-form" onSubmit={handleSubmit}>
          <label>
            Emri i plotë
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

          <div className="avatar-picker">
            <span>Zgjidh avatarin</span>
            <div className="avatar-grid">
              {avatarOptions.map((avatar) => (
                <button
                  key={avatar.id}
                  type="button"
                  className={`avatar-option ${avatarId === avatar.id ? 'avatar-option-active' : ''}`}
                  style={{ background: avatar.background }}
                  onClick={() => setAvatarId(avatar.id)}
                >
                  <span className="avatar-emoji" role="img" aria-label={avatar.label}>
                    {avatar.emoji}
                  </span>
                  <span>{avatar.label}</span>
                </button>
              ))}
            </div>
          </div>

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

          {error && <p className="auth-error">{error}</p>}

          <div className="modal-actions">
            <button type="submit">Krijo nxënësin</button>
            <button type="button" className="secondary" onClick={onClose}>
              Anulo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentSetupModal;
