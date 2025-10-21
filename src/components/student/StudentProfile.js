// Kompetenca: Personale & Qytetare (vetë-reflektim dhe planifikim)
// Rezultati i të nxënit: Analizon evidencat e veta, badge dhe përcakton hapat e ardhshëm
// Evidencë: Timeline me arsyetime të ruajtura dhe numërim i badge/kompetencave

import { useEffect, useState } from 'react';
import { gradeOptions } from '../../data/curriculum';
import { avatarOptions, findAvatar } from '../../utils/avatars';

function StudentProfile({
  student,
  stats,
  isStaff,
  onUpdate,
  onRequestNameChange,
}) {
  const [email, setEmail] = useState(student.email);
  const [grade, setGrade] = useState(student.grade);
  const [avatarId, setAvatarId] = useState(student.avatarId);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [requestName, setRequestName] = useState('');
  const [requestReason, setRequestReason] = useState('');
  const [requestError, setRequestError] = useState('');
  const [requestMessage, setRequestMessage] = useState('');

  useEffect(() => {
    setEmail(student.email);
    setGrade(student.grade);
    setAvatarId(student.avatarId);
    setNewPassword('');
    setConfirmPassword('');
    setMessage('');
    setError('');
    setRequestName('');
    setRequestReason('');
    setRequestError('');
    setRequestMessage('');
  }, [student]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    if (newPassword || confirmPassword) {
      if (newPassword !== confirmPassword) {
        setError('Fjalëkalimi i ri duhet të përputhet me konfirmimin.');
        return;
      }
      if (newPassword.length < 6) {
        setError('Fjalëkalimi i ri duhet të ketë të paktën 6 karaktere.');
        return;
      }
    }

    onUpdate(student.id, {
      email: email.trim(),
      grade: isStaff ? grade : student.grade,
      avatarId,
      password: newPassword ? newPassword : undefined,
    });
    setMessage('Preferencat u ruajtën me sukses.');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleNameRequest = (event) => {
    event.preventDefault();
    setRequestError('');
    setRequestMessage('');

    try {
      onRequestNameChange(student.id, requestName, requestReason);
      setRequestMessage('Kërkesa u dërgua. Stafi do ta shqyrtojë sa më shpejt.');
      setRequestName('');
      setRequestReason('');
    } catch (err) {
      setRequestError(err.message ?? 'Kërkesa nuk u dërgua.');
    }
  };

  const latestActivities = stats.timeline.slice(0, 4);
  const recommended = stats.recommended;
  const competencyEntries = Object.entries(stats.competencySummary ?? {});
  const topCompetency =
    competencyEntries.length > 0
      ? [...competencyEntries].sort((a, b) => b[1] - a[1])[0][0]
      : null;

  const formatDateTime = (value) =>
    new Date(value).toLocaleString('sq-AL', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });

  const completedLessons = stats.completedModules;
  const totalLessons = stats.totalModules;

  return (
    <section className="student-profile">
      <header className="section-header">
        <div>
          <h2>Profili i nxënësit</h2>
          <p>Përmbledhje e progresit, badge-ve dhe preferencave personale.</p>
        </div>
      </header>

      <div className="profile-overview">
        <div className="profile-identity">
          <div className="identity-main">
            <span
              className="identity-avatar"
              style={{ background: findAvatar(student.avatarId).background }}
            >
              {findAvatar(student.avatarId).emoji}
            </span>
            <div>
              <h3>{student.name}</h3>
              <p>Email: {student.email}</p>
              <p>Klasa: {student.grade}</p>
            </div>
          </div>
          <div className="identity-badges">
            {stats.badges.length > 0 ? (
              stats.badges.map((badge) => (
                <div key={badge.id} className="badge-pill">
                  <span>{badge.icon}</span>
                  <div>
                    <strong>{badge.title}</strong>
                    <p>{badge.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>Badge-t do të shfaqen sapo të përfundosh më shumë aktivitete.</p>
            )}
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-card">
            <span className="stat-label">Përfundimi i planit</span>
            <strong>{stats.completionPercent}%</strong>
            <span className="stat-sub">
              {completedLessons}/{totalLessons} mësime
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Kuize perfekte</span>
            <strong>{stats.perfectQuizzes}</strong>
            <span className="stat-sub">Tentativa gjithsej: {stats.totalAttempts}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Ditë radhazi aktive</span>
            <strong>{stats.streakDays}</strong>
            <span className="stat-sub">Mbaj ritmin çdo ditë!</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Koha në studime</span>
            <strong>{Math.round(stats.studyMinutes / 60)} h</strong>
            <span className="stat-sub">{stats.studyMinutes} min totale</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Evidenca të regjistruara</span>
            <strong>{stats.evidenceCount}</strong>
            <span className="stat-sub">
              {topCompetency
                ? `Kompetenca më aktive: ${topCompetency}`
                : 'Shto arsyetimet e tua në kuize.'}
            </span>
          </div>
        </div>

        <div className="progress-bars">
          <div className="progress-row">
            <div className="progress-label">
              <span>Leximi</span>
              <span>{stats.readingPercent}%</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${stats.readingPercent}%` }} />
            </div>
          </div>
          <div className="progress-row">
            <div className="progress-label">
              <span>Aktivitetet</span>
              <span>{stats.activityPercent}%</span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill progress-fill-secondary"
                style={{ width: `${stats.activityPercent}%` }}
              />
            </div>
          </div>
          <div className="progress-row">
            <div className="progress-label">
              <span>Indeksi i angazhimit</span>
              <span>{stats.engagementScore}/100</span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill progress-fill-tertiary"
                style={{ width: `${stats.engagementScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="profile-grid">
        <div className="profile-column">
          <div className="profile-card">
            <h3>Aktivitetet e fundit</h3>
            {latestActivities.length ? (
              <ul className="activity-list">
                {latestActivities.map((activity) => (
                  <li
                    key={
                      activity.evidenceId ??
                      `${activity.moduleId}-${activity.at instanceof Date ? activity.at.getTime() : activity.at}`
                    }
                  >
                    <div className="activity-header">
                      <strong>{activity.title}</strong>
                      <span>{activity.subject}</span>
                      {activity.competency && (
                        <span className="activity-competency">{activity.competency}</span>
                      )}
                    </div>
                    <p className="activity-reasoning">
                      Arsyetim:{' '}
                      {activity.reasoning
                        ? activity.reasoning
                        : 'Plotëso një arsyetim për ta kthyer këtë aktivitet në evidencë.'}
                    </p>
                    <div className="activity-meta">
                      <span>
                        Pikët {activity.score}/{activity.total}
                      </span>
                      <span>{formatDateTime(activity.at)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Filloni kuizin e parë për të ndërtuar historikun tuaj.</p>
            )}
          </div>

          <div className="profile-card">
            <h3>Hapat e ardhshëm të rekomanduar</h3>
            {recommended.length ? (
              <ul className="recommended-list">
                {recommended.map((item) => (
                  <li key={item.moduleId}>
                    <div>
                      <strong>{item.title}</strong>
                      <span>{item.subject}</span>
                    </div>
                    <p>{item.reason}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Je në rrugë të mbarë! Vazhdoni me çfarëdo teme që ju pëlqen.</p>
            )}
          </div>
        </div>

        <div className="profile-column">
          <div className="profile-card">
            <h3>Preferencat e llogarisë</h3>
            <form className="profile-form" onSubmit={handleSubmit}>
              <label>
                Emri i plotë
                <input type="text" value={student.name} readOnly />
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
                <select
                  value={grade}
                  onChange={(event) => setGrade(event.target.value)}
                  disabled={!isStaff}
                >
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
                      className={`avatar-option ${
                        avatarId === avatar.id ? 'avatar-option-active' : ''
                      }`}
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
                Fjalëkalimi i ri (opsionale)
                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                />
              </label>
              <label>
                Konfirmo fjalëkalimin e ri
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
              </label>

              <div className="profile-actions">
                <button type="submit">Ruaj ndryshimet</button>
                {message && <span className="profile-message">{message}</span>}
                {error && <span className="auth-error">{error}</span>}
              </div>
            </form>
          </div>

          <div className="profile-card">
            <h3>Kërkesë për ndryshim emri</h3>
            {student.pendingNameRequest ? (
              <div className="request-info">
                <p>Kërkesë në pritje:</p>
                <strong>{student.pendingNameRequest.desiredName}</strong>
                <span>
                  Dërguar më {formatDateTime(student.pendingNameRequest.submittedAt)}
                </span>
                {student.pendingNameRequest.reason && (
                  <p className="request-reason">
                    Arsyeja: {student.pendingNameRequest.reason}
                  </p>
                )}
                <p className="request-hint">
                  Stafi do t’ju njoftojë sapo të shqyrtohet kërkesa.
                </p>
              </div>
            ) : (
              <form className="name-request-form" onSubmit={handleNameRequest}>
                <label>
                  Emri i ri i dëshiruar
                  <input
                    type="text"
                    value={requestName}
                    onChange={(event) => setRequestName(event.target.value)}
                    placeholder="p.sh. Arta M. Kosova"
                    required
                  />
                </label>
                <label>
                  Pse dëshiron ta ndryshosh?
                  <textarea
                    value={requestReason}
                    onChange={(event) => setRequestReason(event.target.value)}
                    placeholder="Shpjego shkurt arsyen (opsionale)"
                  />
                </label>
                <div className="profile-actions">
                  <button type="submit">Dërgo kërkesën</button>
                </div>
                {requestMessage && <span className="profile-message">{requestMessage}</span>}
                {requestError && <span className="auth-error">{requestError}</span>}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default StudentProfile;
