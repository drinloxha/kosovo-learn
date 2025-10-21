import { useMemo } from 'react';
import { gradeOptions } from '../../data/curriculum';

const resolveLessonStatus = (moduleProgress) => {
  if (!moduleProgress) {
    return { key: 'ready', label: 'Gati për nisje' };
  }
  if (moduleProgress.completed) {
    return { key: 'complete', label: 'Komplet' };
  }
  if (moduleProgress.quizPerfect) {
    return { key: 'complete', label: 'Komplet' };
  }
  if (moduleProgress.attempts) {
    return { key: 'progress', label: 'Në progres' };
  }
  if (Array.isArray(moduleProgress.readingDone) && moduleProgress.readingDone.length > 0) {
    return { key: 'reading', label: 'Lexim i nisur' };
  }
  return { key: 'ready', label: 'Gati për nisje' };
};

const extractMinutes = (value) => {
  if (!value) {
    return 0;
  }
  const match = value.toString().match(/\d+/);
  return match ? Number(match[0]) : 0;
};

function StudentHome({
  student,
  subjects,
  quickLessons,
  modules = [],
  grade,
  canBrowseGrades,
  lockedCount,
  nextLesson,
  progress,
  currentWeek,
  onOpenSubjects,
  onOpenQuizzes,
  onOpenChat,
  onOpenReading,
  onContinueLesson,
}) {
  const primaryLesson = nextLesson ?? quickLessons[0] ?? null;
  const primaryProgress = primaryLesson ? progress?.[primaryLesson.id] ?? {} : null;
  const primaryStatus = resolveLessonStatus(primaryProgress);
  const stats = useMemo(() => {
    const modulesList = Array.isArray(modules) ? modules : [];
    const totals = {
      total: modulesList.length,
      completed: 0,
      inProgress: 0,
      evidence: 0,
      readingPages: 0,
      quizAttempts: 0,
      plannedMinutes: 0,
    };
    modulesList.forEach((module) => {
      const moduleState = progress?.[module.id] ?? {};
      const moduleCompleted = Boolean(moduleState.completed || moduleState.quizPerfect);
      const readingCount = Array.isArray(moduleState.readingDone)
        ? moduleState.readingDone.length
        : 0;
      const hasStarted =
        moduleState.attempts > 0 || (Array.isArray(moduleState.readingDone) && readingCount > 0);
      totals.plannedMinutes += extractMinutes(module.timeEstimate);
      totals.evidence += Array.isArray(moduleState.evidenceLog)
        ? moduleState.evidenceLog.length
        : 0;
      totals.readingPages += readingCount;
      totals.quizAttempts += moduleState.attempts ?? 0;
      if (moduleCompleted) {
        totals.completed += 1;
      } else if (hasStarted) {
        totals.inProgress += 1;
      }
    });
    return totals;
  }, [modules, progress]);

  const quickMinutes = useMemo(
    () =>
      quickLessons.reduce(
        (sum, lesson) => sum + extractMinutes(lesson.timeEstimate),
        0
      ),
    [quickLessons]
  );

  const completionPercent =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  const ringColor =
    completionPercent >= 80
      ? '#22c55e'
      : completionPercent >= 45
      ? '#38bdf8'
      : '#6366f1';
  const ringStyle = {
    background: `conic-gradient(${ringColor} ${completionPercent}%, rgba(226, 232, 240, 0.35) ${completionPercent}% 100%)`,
  };
  const weekDescriptor = typeof currentWeek === 'number' ? `Java ${currentWeek}` : 'Planifikimi ditor';
  const minutesTarget = stats.plannedMinutes || quickMinutes || 30;
  const encouragement = useMemo(() => {
    if (stats.total === 0) {
      return 'Aktualisht nuk ka tema të hapura. Kontrollo planin e lëndëve për të nisur.';
    }
    if (completionPercent >= 80) {
      return 'Fantastik! Mbyll edhe pak evidenca për të siguruar badge-n e javës.';
    }
    if (completionPercent >= 45) {
      return 'Je në ritëm të mirë. Ruaj një evidencë të re sot për të forcuar njohuritë.';
    }
    return 'Nis me fokusin e ditës dhe shëno një evidencë të re për të mos mbetur prapa.';
  }, [completionPercent, stats.total]);
  const studyHint =
    minutesTarget > 0
      ? `Syno për ${minutesTarget} min studim të fokusuara sot.`
      : 'Rezervo të paktën 30 minuta për një mësim të plotë.';

  const heroMetrics = [
    {
      id: 'completed',
      label: 'Tema të kompletuara',
      value: stats.total > 0 ? `${stats.completed}/${stats.total}` : '0',
    },
    {
      id: 'evidence',
      label: 'Evidenca të regjistruara',
      value: stats.evidence,
    },
    {
      id: 'reading',
      label: 'Faqe të lexuara',
      value: stats.readingPages,
    },
  ];

  const learningSteps = [
    {
      id: 'subjects',
      title: 'Zgjidh lëndën',
      description:
        'Hap panelin me lëndët aktive për të zgjedhur temën që i përket javës aktuale.',
      actionLabel: 'Shiko lëndët',
      onClick: onOpenSubjects,
      status:
        lockedCount > 0
          ? `${subjects.length} lëndë • ${lockedCount} të kyçura`
          : `${subjects.length} lëndë aktive`,
    },
  ];

  if (primaryLesson) {
    learningSteps.push({
      id: 'lesson',
      title: primaryLesson.hasReading ? 'Lexo temën kryesore' : 'Nis mësimin kryesor',
      description: `Tema “${primaryLesson.title}” është ${primaryStatus.label.toLowerCase()}${
        primaryLesson.timeEstimate ? ` • ${primaryLesson.timeEstimate}` : ''
      }.`,
      actionLabel: primaryLesson.hasReading ? 'Lexo tani' : 'Hap mësimin',
      onClick: () => {
        if (primaryLesson.hasReading) {
          onOpenReading?.(primaryLesson.id);
        } else {
          onContinueLesson?.(primaryLesson);
        }
      },
      status: primaryLesson.week
        ? `Java ${primaryLesson.week} • ${primaryStatus.label}`
        : primaryStatus.label,
    });
  } else {
    learningSteps.push({
      id: 'lesson',
      title: 'Tema në përgatitje',
      description: 'Sapo të planifikohen mësime të reja ato do të shfaqen automatikisht këtu.',
      actionLabel: 'Shiko planin',
      onClick: onOpenSubjects,
      status: 'Në pritje',
    });
  }

  learningSteps.push(
    {
      id: 'quiz',
      title: 'Vlerëso veten',
      description: 'Hap kuizin për të ruajtur evidencën dhe të kontrollosh arsyetimin.',
      actionLabel: 'Hap kuizet',
      onClick: () => onOpenQuizzes?.(primaryLesson?.id),
      status:
        primaryProgress?.evidenceLog?.length > 0
          ? `${primaryProgress.evidenceLog.length} evidencë`
          : 'Pa evidencë ende',
    },
    {
      id: 'support',
      title: 'Kërko ndihmë',
      description: 'Përdor chat-in për të pyetur stafin sapo të ngecësh ose të kesh ide të reja.',
      actionLabel: 'Hap chatin',
      onClick: onOpenChat,
      status: 'Mbështetje e shpejtë',
    }
  );

  return (
    <section className="student-home">
      <div className="hero-card">
        <div className="hero-brief">
          <p className="hero-eyebrow">Mirë se erdhe, {student.name}!</p>
          <h1 className="hero-title">Planifiko ditën tënde të mësimit</h1>
          <p className="hero-subtitle">
            {weekDescriptor}. {encouragement} {studyHint}
          </p>
          {nextLesson ? (
            <div className="daily-focus">
              <span className="daily-label">Fokusi i ditës</span>
              <h2>{nextLesson.title}</h2>
              <p>{nextLesson.summary}</p>
              <div className="daily-actions">
                {nextLesson.hasReading && (
                  <button
                    type="button"
                    className="button"
                    onClick={() => onOpenReading?.(nextLesson.id)}
                  >
                    Lexo tani
                  </button>
                )}
                <button
                  type="button"
                  className="button secondary"
                  onClick={() => onContinueLesson?.(nextLesson)}
                >
                  Vazhdo temën
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="hero-actions">
                <button type="button" className="button" onClick={onOpenSubjects}>
                  Shiko lëndët
                </button>
                <button
                  type="button"
                  className="button secondary"
                  onClick={() => onOpenQuizzes?.()}
                >
                  Hap kuizet
                </button>
                <button type="button" className="button secondary" onClick={onOpenChat}>
                  Bisedo me stafin
                </button>
              </div>
            </>
          )}
        </div>
        <div className="hero-insight">
          <div className="hero-progress">
            <div className="progress-ring" style={ringStyle}>
              <div className="progress-inner">
                <strong>{completionPercent}%</strong>
                <span>Kompletim</span>
              </div>
            </div>
            <div className="progress-caption">
              <strong>
                {stats.total > 0 ? `${stats.completed}/${stats.total}` : 'Në pritje'}
              </strong>
              <span>{stats.total > 0 ? 'Tema të javës' : 'Plani pritet'}</span>
            </div>
          </div>
          <div className="hero-metrics">
            {heroMetrics.map((metric) => (
              <div key={metric.id} className="metric-card">
                <span className="metric-label">{metric.label}</span>
                <strong className="metric-value">{metric.value}</strong>
              </div>
            ))}
          </div>
          <div className="hero-visual" aria-hidden="true">
            <span className="visual-shape visual-circle" />
            <span className="visual-shape visual-triangle" />
            <span className="visual-shape visual-dots" />
          </div>
        </div>
      </div>

      {lockedCount > 0 && (
        <div className="locked-reminder">
          {lockedCount} temat e javëve të ardhshme do të hapen automatikisht sapo të vijë java
          përkatëse. Qëndro në ritëm dhe kontrollo chat-in nëse ke nevojë për ndihmë.
        </div>
      )}

      <div className="home-section">
        <div className="section-header">
          <div>
            <h2>Udhërrëfyesi i ditës</h2>
            <p>Ndjek këto hapa çdo ditë që të dish saktë ku të fillosh dhe si të mbyllësh evidencat.</p>
          </div>
        </div>
        <div className="learning-flow">
          {learningSteps.map((step, index) => (
            <article key={step.id} className="flow-card">
              <span className="flow-index">Hapi {index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              <div className="flow-footer">
                <span className="flow-status">{step.status}</span>
                <button type="button" className="button" onClick={step.onClick}>
                  {step.actionLabel}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="home-section">
        <div className="section-header">
          <div>
            <h2>Lëndët</h2>
            <p>Zgjidh një lëndë për të vazhduar me mësimet.</p>
          </div>
          <button type="button" onClick={onOpenSubjects}>
            Të gjitha lëndët →
          </button>
        </div>
        <div className="chip-grid">
          {subjects.map((subject) => (
            <span key={subject.id} className="chip">
              {subject.icon} {subject.name}
            </span>
          ))}
          {!subjects.length && (
            <span className="chip chip-muted">Nuk ka lëndë për këtë klasë ende</span>
          )}
        </div>
      </div>

      <div className="home-section">
        <div className="section-header">
          <h2>{canBrowseGrades ? 'Klasat' : 'Klasa jote'}</h2>
        </div>
        <div className="chip-grid">
          {canBrowseGrades ? (
            gradeOptions.map((option) => (
              <span key={option} className={`chip ${grade === option ? 'chip-active' : ''}`}>
                Klasa {option}
              </span>
            ))
          ) : (
            <span className="chip chip-active">Klasa {grade}</span>
          )}
        </div>
      </div>

      <div className="home-section">
        <div className="section-header">
          <div>
            <h2>Shto së shpejti</h2>
            <p>Temat më interesante për të nisur menjëherë.</p>
          </div>
          <button type="button" onClick={onOpenQuizzes}>
            Kuizet e klasës →
          </button>
        </div>
        <div className="quick-grid">
          {quickLessons.map((lesson) => {
            const hasReading = lesson.hasReading;
            const moduleProgress = progress?.[lesson.id] ?? {};
            const lessonStatus = resolveLessonStatus(moduleProgress);
            const evidenceCount = Array.isArray(moduleProgress.evidenceLog)
              ? moduleProgress.evidenceLog.length
              : 0;
            const readingDone = Array.isArray(moduleProgress.readingDone)
              ? moduleProgress.readingDone.length
              : 0;
            const totalPages = lesson.totalPages ?? 0;
            const quizAttempts = moduleProgress.attempts ?? 0;
            const readingSummary = hasReading
              ? totalPages > 0
                ? `Leximi: ${Math.min(readingDone, totalPages)}/${totalPages} faqe`
                : `Leximi: ${readingDone} faqe të shënuara`
              : 'Lexim i lirë';
            const quizSummary = `Kuizi: ${quizAttempts} tentativa`;
            return (
              <article key={lesson.id} className="quick-card" style={{ borderColor: lesson.color }}>
                <span className="quick-icon">{lesson.icon}</span>
                <h3>{lesson.title}</h3>
                <p>{lesson.summary}</p>
                <div className="quick-meta">
                  <span>{lesson.subjectName}</span>
                  <span>{lesson.timeEstimate}</span>
                </div>
                <div className="quick-status">
                  <span className={`status-pill status-${lessonStatus.key}`}>{lessonStatus.label}</span>
                  <span>{evidenceCount ? `${evidenceCount} evidencë` : 'Pa evidencë ende'}</span>
                </div>
                <div className="quick-progress">
                  <span>{readingSummary}</span>
                  <span>{quizSummary}</span>
                </div>
                <div className="quick-actions">
                  {hasReading && (
                    <button type="button" className="button secondary" onClick={() => onOpenReading?.(lesson.id)}>
                      Lexo materialin
                    </button>
                  )}
                  <button
                    type="button"
                    className="button"
                    onClick={() => onOpenQuizzes?.(lesson.id)}
                  >
                    Hap kuizin
                  </button>
                </div>
              </article>
            );
          })}
          {!quickLessons.length && (
            <div className="quick-empty">
              Nuk ka mësime të gatshme për këtë klasë. Shiko panelin e stafit për të shtuar mësime
              të reja.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default StudentHome;
