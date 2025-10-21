// Kompetenca: Të menduarit (kritik/kreativ) & Të mësuarit për të nxënë
// Rezultati i të nxënit: Arsyeton hapat e zgjidhjes dhe lidhet me koncepte kyçe të lëndës
// Evidencë: Çdo dorëzim ruan rezultatin, arsyetimin dhe kompetencën në localStorage

import { useEffect, useMemo, useState } from 'react';

function QuickQuiz({ module, planEntry, progress, onComplete }) {
  const questions = useMemo(() => module.quiz?.questions ?? [], [module]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [result, setResult] = useState(null);
  const plannedOutcomes =
    planEntry?.outcomes?.length > 0 ? planEntry.outcomes : module.outcomes ?? [];
  const plannedCompetencies =
    planEntry?.competencies?.length > 0 ? planEntry.competencies : module.competencies ?? [];
  const hasQuestions = questions.length > 0;
  const totalPages = Array.isArray(module.reading) ? module.reading.length : 0;
  const readingRequired = totalPages > 0;
  const readingDoneCount = progress?.readingDone?.length ?? 0;
  const readingComplete = !readingRequired || readingDoneCount >= totalPages;

  const quizPerfect =
    progress?.quizPerfect ?? (progress?.total ? progress.score === progress.total : false);
  const reasoningValid = progress?.lastReasoningValid ?? false;
  const quizSuccess = quizPerfect || (result ? result.score === result.total : false);

  useEffect(() => {
    setSelectedOptions({});
    setResult(null);
  }, [module.id, progress?.lastReasoning]);

  const allAnswered = useMemo(
    () => questions.every((question) => selectedOptions[question.id] !== undefined),
    [questions, selectedOptions]
  );

  const latestScore = progress?.score ?? result?.score ?? 0;
  const totalQuestions = progress?.total ?? result?.total ?? questions.length;
  const attempts = progress?.attempts ?? (result ? 1 : 0);

  const handleSelect = (questionId, optionIndex) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmit = () => {
    if (!hasQuestions || !allAnswered) {
      return;
    }

    if (!readingComplete) {
      return;
    }

    const checked = questions.map((question) => {
      const selected = selectedOptions[question.id];
      return {
        ...question,
        selected,
        isCorrect: selected === question.answerIndex,
      };
    });

    const score = checked.filter((item) => item.isCorrect).length;
    const payload = {
      score,
      total: questions.length,
      reasoning: '',
      reasoningValid: true,
      answers: checked.map((item) => ({
        id: item.id,
        selected: item.selected,
        isCorrect: item.isCorrect,
      })),
      competency: plannedCompetencies.length ? plannedCompetencies[0] : module.competencies?.[0],
      outcome: plannedOutcomes.length ? plannedOutcomes[0] : module.outcomes?.[0],
    };

    setResult({ checked, score, total: questions.length });
    onComplete(module.id, payload);
  };

  const handleRetry = () => {
    setSelectedOptions({});
    setResult(null);
  };

  return (
    <section className="quiz-card">
      <div className="quiz-header">
        <div>
          <h3>{module.topic}</h3>
          <p>{module.overview}</p>
          {plannedCompetencies.length > 0 && (
            <p className="quiz-competencies">
              <strong>Kompetenca:</strong> {plannedCompetencies.join(' • ')}
            </p>
          )}
          {plannedOutcomes.length > 0 && (
            <p className="quiz-outcomes">
              <strong>Rezultati i të nxënit:</strong> {plannedOutcomes[0]}
            </p>
          )}
          {planEntry?.notes && (
            <p className="quiz-notes">
              <strong>Shënim nga stafi:</strong> {planEntry.notes}
            </p>
          )}
        </div>
        <div className="quiz-meta">
          <span>
            Pikët e fundit: {latestScore}/{totalQuestions}
          </span>
          {attempts > 0 && <span>Tentativa: {attempts}</span>}
          {readingRequired && (
            <span>
              Leximi: {Math.min(readingDoneCount, totalPages)}/{totalPages} faqe
            </span>
          )}
          {(quizSuccess || reasoningValid) && <span className="quiz-completed">Kuizi i plotë</span>}
        </div>
      </div>

      {Array.isArray(module.assessmentCriteria) && module.assessmentCriteria.length > 0 && (
        <div className="quiz-criteria">
          <h4>Kriteret e vlerësimit</h4>
          <ul>
            {module.assessmentCriteria.map((criterion) => (
              <li key={criterion}>{criterion}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="quiz-questions">
        {hasQuestions ? (
          questions.map((question, index) => {
            const selected = selectedOptions[question.id];
            const feedback =
              result?.checked?.find((item) => item.id === question.id) ?? result?.checked?.[index];
            const optionClass = (optionIndex) => {
              if (!result) {
                return selected === optionIndex ? 'question-option option-selected' : 'question-option';
              }

              const isSelected = selected === optionIndex;
              const isCorrect = question.answerIndex === optionIndex;

              if (isCorrect) {
                return 'question-option option-correct';
              }

              if (isSelected && !isCorrect) {
                return 'question-option option-incorrect';
              }

              return 'question-option';
            };

            return (
              <article key={question.id} className="quiz-question">
                <div className="question-label">Pyetja {index + 1}</div>
                <p className="question-prompt">{question.prompt}</p>
                <div className="question-options">
                  {question.options.map((option, optionIndex) => (
                    <button
                      key={`${question.id}-${optionIndex}`}
                      type="button"
                      className={optionClass(optionIndex)}
                      onClick={() => handleSelect(question.id, optionIndex)}
                      disabled={!!result}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {result && (
                  <p
                    className={`question-feedback ${
                      feedback?.isCorrect ? 'feedback-correct' : 'feedback-incorrect'
                    }`}
                  >
                    {feedback?.isCorrect
                      ? 'Saktë!'
                      : `Përgjigjja e duhur: ${question.options[question.answerIndex]}`}
                    {!feedback?.isCorrect && (
                      <span className="feedback-explanation">{question.explanation}</span>
                    )}
                  </p>
                )}
              </article>
            );
          })
        ) : (
          <div className="quick-empty">
            Ky kuiz do të përditësohet me pyetje. Shiko materialet e leximit dhe aktivitetet e
            lëndës ndërkohë.
          </div>
        )}
      </div>

      <div className="quiz-actions">
        <button
          type="button"
          className="quiz-submit"
          disabled={!hasQuestions || !readingComplete || !allAnswered || !!result}
          onClick={handleSubmit}
        >
          Dorëzo përgjigjet
        </button>
        {result && !quizSuccess && hasQuestions && (
          <button type="button" className="quiz-retry" onClick={handleRetry}>
            Provo përsëri
          </button>
        )}
      </div>

      {result && hasQuestions && (
        <div className="quiz-summary">
          {result.score === result.total ? (
            <strong>Shkëlqyeshëm! I saktë në të gjitha pyetjet.</strong>
          ) : (
            <strong>
              Pikët: {result.score}/{result.total}. Rishiko shënimet dhe provo përsëri.
            </strong>
          )}
        </div>
      )}
    </section>
  );
}

export default QuickQuiz;
