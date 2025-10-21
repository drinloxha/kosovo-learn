import { useMemo, useState } from 'react';

function StaffLessons({ library, customModules = [], onEditModule }) {
  const [subjectId, setSubjectId] = useState(library[0]?.id ?? '');

  const subject = library.find((item) => item.id === subjectId) ?? library[0] ?? null;
  const customModuleIds = useMemo(() => new Set(customModules.map((module) => module.id)), [customModules]);

  return (
    <section className="staff-lessons">
      <header className="section-header">
        <div>
          <h2>Mësimet sipas lëndës</h2>
          <p>Zgjidh një lëndë për të parë mësimet aktive.</p>
        </div>
        <select value={subject?.id ?? ''} onChange={(event) => setSubjectId(event.target.value)}>
          {library.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </header>

      <div className="lesson-grid">
        {subject?.lessons.map((lesson) => (
          <article key={lesson.id} className="lesson-card">
            <div className="lesson-header">
              <span className="lesson-grade">Klasa {lesson.grade}</span>
              <span className="lesson-time">{lesson.timeEstimate}</span>
            </div>
            <h3>{lesson.title}</h3>
            <p>{lesson.summary}</p>
            <div className="lesson-meta">
              <span>{lesson.activities} aktivitete</span>
              <span>{(lesson.segments?.length ?? lesson.readingPages?.length ?? 0)} faqe lexim</span>
              <span>{lesson.quizQuestions} pyetje kuizi</span>
            </div>
            {lesson.moduleId && customModuleIds.has(lesson.moduleId) ? (
              <button
                type="button"
                className="lesson-manage"
                onClick={() => onEditModule?.(lesson.moduleId, subject.id)}
              >
                Menaxho literaturën
              </button>
            ) : (
              <span className="lesson-hint">Moduli bazë i kurrikulës (shto kopje të re për personalizim).</span>
            )}
          </article>
        ))}
        {!subject?.lessons.length && (
          <div className="quick-empty">
            Kjo lëndë nuk ka mësime ende. Shto mësimin e parë nga formulari “Shto mësim”.
          </div>
        )}
      </div>
    </section>
  );
}

export default StaffLessons;
