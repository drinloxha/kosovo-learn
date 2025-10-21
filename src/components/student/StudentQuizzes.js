// Kompetenca: Të mësuarit për të nxënë (planifikim i progresit)
// Rezultati i të nxënit: Nxënësi monitoron kuizet ditore dhe evidencat për secilin modul
// Evidencë: Statistikat e kuizeve dhe evidencat e ruajtura shfaqen në panelin e planifikimit

import { useMemo } from 'react';
import { getModulePlanEntry, getModuleWeekFromPlan } from '../../utils/curriculumPlan';
import QuickQuiz from './QuickQuiz';

const getModuleStatus = (moduleProgress) => {
  if (!moduleProgress) {
    return { key: 'ready', label: 'I pa nisur' };
  }
  if (moduleProgress.completed || moduleProgress.quizPerfect) {
    return { key: 'complete', label: 'Komplet' };
  }
  if (moduleProgress.attempts) {
    return { key: 'progress', label: 'Në progres' };
  }
  if (Array.isArray(moduleProgress.readingDone) && moduleProgress.readingDone.length > 0) {
    return { key: 'reading', label: 'Lexim i nisur' };
  }
  return { key: 'ready', label: 'I pa nisur' };
};

function StudentQuizzes({
  grade,
  plan,
  modules,
  activeModule,
  progress,
  onSelectModule,
  onCompleteQuiz,
  onStartReading,
}) {
  const sortedModules = useMemo(
    () =>
      modules
        .map((module) => ({
          module,
          week: getModuleWeekFromPlan(plan, grade, module.id, module.week ?? 1),
        }))
        .sort((a, b) => {
          if (a.week !== b.week) {
            return a.week - b.week;
          }
          if (a.module.subject !== b.module.subject) {
            return a.module.subject.localeCompare(b.module.subject, 'sq');
          }
          return a.module.topic.localeCompare(b.module.topic, 'sq');
        }),
    [modules, plan, grade]
  );

  const stats = useMemo(() => {
    const totals = {
      total: sortedModules.length,
      completed: 0,
      inProgress: 0,
      attempts: 0,
      evidence: 0,
    };

    sortedModules.forEach(({ module }) => {
      const moduleProgress = progress[module.id] ?? {};
      const status = getModuleStatus(moduleProgress);
      const evidenceCount = Array.isArray(moduleProgress.evidenceLog)
        ? moduleProgress.evidenceLog.length
        : 0;

      totals.attempts += moduleProgress.attempts ?? 0;
      totals.evidence += evidenceCount;

      if (status.key === 'complete') {
        totals.completed += 1;
      } else if (status.key !== 'ready') {
        totals.inProgress += 1;
      }
    });

    return totals;
  }, [sortedModules, progress]);

  const completionPercent =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const nextModuleEntry = useMemo(() => {
    for (const { module, week } of sortedModules) {
      const moduleProgress = progress[module.id] ?? {};
      const status = getModuleStatus(moduleProgress);
      if (status.key !== 'complete') {
        return { module, week, status };
      }
    }
    return sortedModules.length ? { ...sortedModules[0], status: { key: 'complete', label: 'Komplet' } } : null;
  }, [sortedModules, progress]);

  const summaryMetrics = [
    {
      id: 'completion',
      label: 'Kompletim i javës',
      value: `${completionPercent}%`,
      hint:
        stats.total > 0
          ? `${stats.completed} nga ${stats.total} tema`
          : 'Shto temat e javës nga paneli i stafit.',
    },
    {
      id: 'attempts',
      label: 'Tentativa sot',
      value: stats.attempts,
      hint: stats.attempts === 1 ? '1 tentativë e regjistruar' : `${stats.attempts} tentativa gjithsej`,
    },
    {
      id: 'evidence',
      label: 'Evidenca të ruajtura',
      value: stats.evidence,
      hint:
        stats.evidence === 0
          ? 'Shëno arsyetimin në fund të kuizit'
          : `${stats.evidence} evidenca në portofol`,
    },
  ];

  if (!sortedModules.length) {
    return (
      <section className="student-quizzes">
        <div className="quick-empty">Nuk ka kuize për këtë klasë për momentin.</div>
      </section>
    );
  }

  const renderModuleCard = (module, week) => {
    const moduleProgress = progress[module.id] ?? {};
    const statusData = getModuleStatus(moduleProgress);
    const evidenceCount = Array.isArray(moduleProgress.evidenceLog)
      ? moduleProgress.evidenceLog.length
      : 0;
    const hasReading =
      (Array.isArray(module.segments) && module.segments.length > 0) ||
      (Array.isArray(module.reading) && module.reading.length > 0);
    const totalPages = hasReading
      ? Array.isArray(module.segments) && module.segments.length
        ? module.segments.length
        : module.reading.length
      : 0;
    const readingDone = Array.isArray(moduleProgress.readingDone)
      ? moduleProgress.readingDone.length
      : 0;

    return (
      <li
        key={module.id}
        className={`quiz-step ${
          activeModule?.id === module.id ? 'quiz-step-active' : ''
        } quiz-step-${statusData.key} ${
          nextModuleEntry?.module.id === module.id ? 'quiz-step-recommended' : ''
        }`}
        onClick={() => onSelectModule(module.id)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onSelectModule(module.id);
          }
        }}
        role="button"
        tabIndex={0}
      >
        <div className="quiz-step-marker" aria-hidden="true">
          <span />
        </div>
        <div className="quiz-step-body">
          <header className="quiz-step-head">
            <div>
              <span className="quiz-step-week">Java {week}</span>
              <h3>{module.topic}</h3>
              <span className="quiz-step-subject">{module.subject}</span>
            </div>
            <span className={`status-pill status-${statusData.key}`}>{statusData.label}</span>
          </header>
          <p className="quiz-step-overview">{module.overview}</p>
          <div className="quiz-step-meta">
            <span>{evidenceCount ? `${evidenceCount} evidencë` : 'Pa evidencë'}</span>
            <span>
              Kuizi: {moduleProgress.attempts ?? 0}{' '}
              {moduleProgress.attempts === 1 ? 'tentativë' : 'tentativa'}
            </span>
            {hasReading ? (
              <span>
                Leximi: {Math.min(readingDone, totalPages)}/{totalPages} faqe
              </span>
            ) : (
              <span>Lexim i lirë</span>
            )}
          </div>
          <div className="quiz-step-actions">
            {hasReading && (
              <button
                type="button"
                className="button secondary"
                onClick={(event) => {
                  event.stopPropagation();
                  onStartReading?.(module.id);
                }}
              >
                Lexo materialin
              </button>
            )}
            <button
              type="button"
              className="button"
              onClick={(event) => {
                event.stopPropagation();
                onSelectModule(module.id);
              }}
            >
              Hap kuizin
            </button>
          </div>
        </div>
      </li>
    );
  };

  const renderFocusCard = () => {
    if (!nextModuleEntry) {
      return null;
    }

    const { module, status, week } = nextModuleEntry;
    const moduleProgress = progress[module.id] ?? {};
    const hasReading =
      (Array.isArray(module.segments) && module.segments.length > 0) ||
      (Array.isArray(module.reading) && module.reading.length > 0);
    const totalPages = hasReading
      ? Array.isArray(module.segments) && module.segments.length
        ? module.segments.length
        : module.reading.length
      : 0;
    const readingDone = Array.isArray(moduleProgress.readingDone)
      ? moduleProgress.readingDone.length
      : 0;

    return (
      <div className="quiz-focus-card">
        <div className="quiz-focus-badge">Tema e ditës</div>
        <header>
          <span className="quiz-focus-week">Java {week}</span>
          <h3>{module.topic}</h3>
          <span className="quiz-focus-subject">{module.subject}</span>
          <span className="quiz-focus-status">{status.label}</span>
        </header>
        <p>{module.overview}</p>
        <div className="quiz-focus-meta">
          {hasReading ? (
            <span>
              Leximi: {Math.min(readingDone, totalPages)}/{totalPages} faqe
            </span>
          ) : (
            <span>Lexim i lirë</span>
          )}
          <span>
            Kuizi: {moduleProgress.attempts ?? 0}{' '}
            {moduleProgress.attempts === 1 ? 'tentativë' : 'tentativa'}
          </span>
        </div>
        <div className="quiz-focus-actions">
          {hasReading && (
            <button
              type="button"
              className="button secondary"
              onClick={() => onStartReading?.(module.id)}
            >
              Fillo me leximin
            </button>
          )}
          <button
            type="button"
            className="button"
            onClick={(event) => {
              event.stopPropagation();
              onSelectModule(module.id);
            }}
          >
            Hap kuizin
          </button>
        </div>
      </div>
    );
  };

  return (
    <section className="student-quizzes">
      <header className="quiz-overview">
        <div className="quiz-overview-text">
          <span className="quiz-overview-eyebrow">Kuizet e planifikuara</span>
          <h2>Çdo temë mbyllet me një kuiz të shkurtër</h2>
          <p>
            Zgjidh temën e ditës, përfundo leximin dhe dorëzo arsyetimin tënd për të ruajtur evidencat.
            {nextModuleEntry
              ? ` Tema e radhës: “${nextModuleEntry.module.topic}” (${nextModuleEntry.status.label}).`
              : ''}
          </p>
        </div>
        <div className="quiz-overview-stats">
          {summaryMetrics.map((metric) => (
            <div key={metric.id} className="quiz-overview-card">
              <span className="quiz-overview-label">{metric.label}</span>
              <strong className="quiz-overview-value">{metric.value}</strong>
              <span className="quiz-overview-hint">{metric.hint}</span>
            </div>
          ))}
        </div>
      </header>

      <div className="quiz-main">
        <aside className="quiz-roadmap">
          <div className="quiz-roadmap-header">
            <div>
              <h3>Rruga e kuizeve</h3>
              <p>Ndiq hapat në rendin e javëve. Tema e ditës është e shënuar me ngjyrë.</p>
            </div>
            <span className="quiz-roadmap-progress">
              {stats.completed}/{stats.total} tema të mbyllura
            </span>
          </div>
          <ol className="quiz-timeline">
            {sortedModules.map(({ module, week }) => renderModuleCard(module, week))}
          </ol>
        </aside>

        <div className="quiz-panel">
          {renderFocusCard()}
          {activeModule ? (
            <QuickQuiz
              module={activeModule}
              planEntry={getModulePlanEntry(plan, grade, activeModule.id)}
              progress={progress[activeModule.id]}
              onComplete={(moduleId, payload) => onCompleteQuiz(moduleId, payload)}
            />
          ) : (
            <div className="quiz-placeholder">
              <h3>Zgjidh një temë për të nisur</h3>
              <p>
                Kliko një nga hapat në rrugën e kuizeve për të parë pyetjet, kriteret e vlerësimit dhe
                evidencat e regjistruara për atë temë.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default StudentQuizzes;
