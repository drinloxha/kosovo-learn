// Kompetenca: Të mësuarit për të nxënë (strategji leximi)
// Rezultati i të nxënit: Nxënësi ndjek leximin e strukturuar, respekton kohën minimale dhe shënon evidencë
// Evidencë: Çdo faqe e lexuar ruhet në progress -> readingDone, që përdoret për të hapur kuizin

import { useEffect, useMemo, useRef, useState } from 'react';

const readingSpeeds = {
  '5': 110,
  '6': 120,
  '7': 130,
  '8': 140,
  '9': 150,
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const estimateDurationSeconds = (text, grade) => {
  const words = text.split(/\s+/).filter(Boolean).length || 30;
  const speed = readingSpeeds[grade] ?? 130;
  const seconds = Math.ceil((words / speed) * 60);
  return clamp(seconds, 20, 120);
};

function StudentReading({
  module,
  grade,
  progressEntry,
  onCompletePage,
  onCompleteModule,
  onExit,
}) {
  const pages = useMemo(() => {
    if (Array.isArray(module.segments) && module.segments.length) {
      return module.segments.map((segment, index) => ({
        id: segment.id ?? `${module.id}-segment-${index}`,
        title: segment.title?.trim() ?? '',
        content: segment.content?.trim() ?? '',
      }));
    }
    const fallback = Array.isArray(module.reading) && module.reading.length
      ? module.reading.map((text, index) => ({
          id: `${module.id}-page-${index}`,
          title: '',
          content: text,
        }))
      : [
          {
            id: `${module.id}-placeholder`,
            title: '',
            content:
              'Ky është material demonstrues. Shto literaturë të plotë në planifikim ose në formularin “Shto mësim” për të krijuar faqe të reja.',
          },
        ];
    return fallback;
  }, [module.id, module.reading, module.segments]);

  const completedSet = useMemo(() => new Set(progressEntry?.readingDone ?? []), [progressEntry]);
  const activities = useMemo(() => {
    if (Array.isArray(module.activities) && module.activities.length) {
      return module.activities;
    }
    if (Array.isArray(module.activityDetails) && module.activityDetails.length) {
      return module.activityDetails;
    }
    return [];
  }, [module.activities, module.activityDetails]);
  const firstIncompleteIndex = useMemo(() => {
    for (let i = 0; i < pages.length; i += 1) {
      if (!completedSet.has(i)) {
        return i;
      }
    }
    return pages.length - 1;
  }, [pages.length, completedSet]);

  const [pageIndex, setPageIndex] = useState(() => clamp(firstIncompleteIndex, 0, pages.length - 1));
  const [secondsLeft, setSecondsLeft] = useState(
    estimateDurationSeconds(
      pages[clamp(firstIncompleteIndex, 0, pages.length - 1)]?.content ?? '',
      grade
    )
  );
  const [timerActive, setTimerActive] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    setPageIndex(clamp(firstIncompleteIndex, 0, pages.length - 1));
  }, [firstIncompleteIndex, pages.length]);

  useEffect(() => {
    const duration = estimateDurationSeconds(pages[pageIndex]?.content ?? '', grade);
    setSecondsLeft(duration);
    setTimerActive(!completedSet.has(pageIndex));
  }, [pageIndex, pages, grade, completedSet]);

  useEffect(() => {
    if (!timerActive || secondsLeft <= 0) {
      return undefined;
    }

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [timerActive, secondsLeft]);

  const handleNext = () => {
    if (!completedSet.has(pageIndex)) {
      onCompletePage(pageIndex, pages.length);
    }

    if (pageIndex === pages.length - 1) {
      onCompleteModule(pages.length);
      return;
    }

    setPageIndex((prev) => Math.min(prev + 1, pages.length - 1));
  };

  const handlePrev = () => {
    setPageIndex((prev) => Math.max(prev - 1, 0));
  };

  const displaySeconds = Math.max(secondsLeft, 0);
  const isCompleted = completedSet.size >= pages.length;
  const canProceed = !timerActive || secondsLeft <= 0 || completedSet.has(pageIndex);

  return (
    <section className="student-reading">
      <header className="section-header">
        <div>
          <h2>{module.topic}</h2>
          <p>{module.overview}</p>
          <span className="reading-meta">
            Faqe {pageIndex + 1} nga {pages.length}
          </span>
        </div>
        <button type="button" className="logout-button secondary" onClick={onExit}>
          Kthehu
        </button>
      </header>

      <div className="reading-panel">
        <article className="reading-page">
          <div className="reading-progress">
            {!canProceed ? (
              <span>
                Kohë e mbetur: <strong>{displaySeconds}s</strong>
              </span>
            ) : (
              <span className="reading-ready">Mund të kalosh në faqen tjetër.</span>
            )}
          </div>
          {pages[pageIndex]?.title && (
            <h3 className="reading-page-title">{pages[pageIndex].title}</h3>
          )}
          <p>{pages[pageIndex]?.content || 'Teksti do të shtohet së shpejti.'}</p>
        </article>
        {activities.length > 0 && (
          <div className="reading-activities">
            <h3>Aktivitete të sugjeruara</h3>
            <ul>
              {activities.map((item, index) => (
                <li key={`activity-${module.id}-${index}`}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="reading-actions">
        <button
          type="button"
          className="secondary"
          onClick={handlePrev}
          disabled={pageIndex === 0}
        >
          Faqja e mëparshme
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!canProceed}
        >
          {pageIndex === pages.length - 1 ? 'Përfundo leximin' : 'Faqja tjetër'}
        </button>
      </div>

      {isCompleted && (
        <div className="reading-complete-note">
          <strong>Leximi u përfundua!</strong> Tani mund të vazhdosh me kuizin për të mbyllur temën.
        </div>
      )}
    </section>
  );
}

export default StudentReading;
