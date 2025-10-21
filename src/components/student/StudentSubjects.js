import { useEffect, useMemo, useState } from 'react';
import { getModuleWeekFromPlan } from '../../utils/curriculumPlan';

function StudentSubjects({
  subjects,
  grade,
  modules,
  plan,
  progress,
  onStartReading,
  onOpenQuizzes,
}) {
  const moduleLookup = useMemo(() => {
    const map = new Map();
    (modules ?? []).forEach((module) => {
      map.set(module.id, module);
    });
    return map;
  }, [modules]);

  const subjectsWithLessons = useMemo(() => {
    return subjects.map((subject) => {
      const lessons = subject.lessons
        .filter((lesson) => lesson.grade === grade && moduleLookup.has(lesson.id))
        .map((lesson) => {
          const module = moduleLookup.get(lesson.id);
          const moduleProgress = progress?.[module.id] ?? {};
          const status = moduleProgress.quizPerfect
            ? 'Komplet'
            : moduleProgress.attempts
            ? 'Në progres'
            : 'I pa nisur';
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
          const week = getModuleWeekFromPlan(
            plan ?? {},
            grade,
            module.id,
            module.week ?? lesson.week ?? 1
          );

          return {
            id: module.id,
            title: module.topic ?? lesson.title,
            summary: module.overview ?? lesson.summary,
            timeEstimate: module.timeEstimate ?? lesson.timeEstimate,
            status,
            hasReading,
            totalPages,
            readingDone,
            subjectName: subject.name,
            week,
          };
        });

      return {
        ...subject,
        lessons,
      };
    });
  }, [subjects, grade, moduleLookup, plan, progress]);

  const [activeSubjectId, setActiveSubjectId] = useState(
    () => subjectsWithLessons.find((subject) => subject.lessons.length > 0)?.id ?? null
  );

  useEffect(() => {
    if (!subjectsWithLessons.length) {
      if (activeSubjectId !== null) {
        setActiveSubjectId(null);
      }
      return;
    }

    const hasActive = subjectsWithLessons.some(
      (subject) => subject.id === activeSubjectId && subject.lessons.length > 0
    );

    if (!hasActive) {
      const next = subjectsWithLessons.find((subject) => subject.lessons.length > 0) ?? null;
      setActiveSubjectId(next?.id ?? null);
    }
  }, [subjectsWithLessons, activeSubjectId]);

  const activeSubject =
    subjectsWithLessons.find((subject) => subject.id === activeSubjectId) ?? null;

  return (
    <section className="student-subjects">
      <header className="section-header">
        <div>
          <h2>Lëndët e klasës {grade}</h2>
          <p>Zgjidh një lëndë për të parë mësimet dhe kuizet përkatëse.</p>
        </div>
      </header>

      <div className="subject-layout">
        <div className="subject-grid">
          {subjectsWithLessons.map((subject) => (
            <article
              key={subject.id}
              className={`subject-card ${
                subject.id === activeSubjectId ? 'subject-card-active' : ''
              } ${subject.lessons.length ? '' : 'subject-card-disabled'}`}
              style={{ background: subject.color }}
              role="button"
              tabIndex={0}
              aria-disabled={subject.lessons.length === 0}
              onClick={() => {
                if (subject.lessons.length > 0) {
                  setActiveSubjectId(subject.id);
                }
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  if (subject.lessons.length > 0) {
                    setActiveSubjectId(subject.id);
                  }
                }
              }}
            >
              <span className="subject-icon">{subject.icon}</span>
              <h3>{subject.name}</h3>
              <p>{subject.description || 'Përditëso planin mësimor nga paneli i stafit.'}</p>
              <div className="subject-meta">
                <span>{subject.lessons.length} mësime</span>
                <span>
                  {subject.lessons.length
                    ? `Java e parë: ${subject.lessons[0].week}`
                    : 'Në pritje të hapjes'}
                </span>
              </div>
            </article>
          ))}
          {!subjectsWithLessons.length && (
            <div className="quick-empty">
              Nuk ka lëndë aktive për këtë klasë. Përdor panelin e stafit për të shtuar lëndë të reja.
            </div>
          )}
        </div>

        <div className="subject-detail">
          {activeSubject ? (
            activeSubject.lessons.length ? (
              <>
                <header className="subject-detail-header">
                  <h3>
                    {activeSubject.icon} {activeSubject.name}
                  </h3>
                  <p>
                    Zgjidh një mësim për të nisur leximin ose për të hapur kuizin. Statusi përditësohet
                    sipas progresit tënd.
                  </p>
                </header>
                <ul className="lesson-list">
                  {activeSubject.lessons.map((lesson) => (
                    <li key={lesson.id} className="lesson-item">
                      <div className="lesson-body">
                        <div className="lesson-meta">
                          <span className="lesson-status">{lesson.status}</span>
                          <span>Java {lesson.week}</span>
                          {lesson.timeEstimate && <span>{lesson.timeEstimate}</span>}
                        </div>
                        <h4>{lesson.title}</h4>
                        <p>{lesson.summary}</p>
                        {lesson.hasReading && (
                          <span className="lesson-reading">
                            Leximi {Math.min(lesson.readingDone, lesson.totalPages)}/
                            {lesson.totalPages} faqe
                          </span>
                        )}
                      </div>
                      <div className="lesson-actions">
                        {lesson.hasReading && (
                          <button
                            type="button"
                            className="button secondary"
                            onClick={() => onStartReading?.(lesson.id)}
                          >
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
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <div className="quick-empty">
                Nuk ka mësime të hapura ende për këtë lëndë. Kontrollo më vonë ose pyet mësuesin.
              </div>
            )
          ) : (
            <div className="quick-empty">
              Zgjidh një lëndë nga lista për të parë mësimet dhe aktivitetet.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default StudentSubjects;
