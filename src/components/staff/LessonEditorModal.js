// Kompetenca: Jetë/punë/mjedis (përmirësim i vazhdueshëm i materialeve)
// Rezultati i të nxënit: Stafi rishikon dhe përditëson literaturën, rezultatet dhe kompetencat e modulit
// Evidencë: Ndryshimet ruhen në customModules dhe planin kurrikular

import { useMemo, useState } from 'react';
import { gradeOptions } from '../../data/curriculum';
import { coreCompetencies } from '../../data/competencies';
import { generateId } from '../../utils/identifiers';

function LessonEditorModal({ module, planEntry, subjectId, onClose, onSave }) {
  const initialSegments = useMemo(() => {
    if (Array.isArray(module.segments) && module.segments.length) {
      return module.segments.map((segment, index) => ({
        id: segment.id ?? generateId('seg'),
        title: segment.title ?? `Segmenti ${index + 1}`,
        content: segment.content ?? '',
      }));
    }
    const fallback = Array.isArray(module.reading) && module.reading.length
      ? module.reading.map((page, index) => ({
          id: generateId('seg'),
          title: `Segmenti ${index + 1}`,
          content: page,
        }))
      : [
          {
            id: generateId('seg'),
            title: 'Hyrje',
            content:
              'Shto literaturën kryesore të mësimit këtu. Ndaj segmentet sipas temave kryesore.',
          },
        ];
    return fallback;
  }, [module.reading, module.segments]);

  const [topic, setTopic] = useState(module.topic ?? '');
  const [summary, setSummary] = useState(module.overview ?? '');
  const [timeEstimate, setTimeEstimate] = useState(module.timeEstimate ?? '20 min');
  const [segments, setSegments] = useState(initialSegments);
  const [activitiesText, setActivitiesText] = useState(
    (module.activities ?? module.activityDetails ?? []).join('\n')
  );
  const [outcomesText, setOutcomesText] = useState(
    (planEntry?.outcomes ?? module.outcomes ?? []).join('\n')
  );
  const [planNotes, setPlanNotes] = useState(planEntry?.notes ?? module.planNotes ?? '');
  const [week, setWeek] = useState(planEntry?.week ?? module.week ?? 1);
  const [selectedCompetencies, setSelectedCompetencies] = useState(() =>
    new Set(planEntry?.competencies ?? module.competencies ?? [])
  );
  const initialQuizState = (module.quiz?.questions ?? []).map((question) => ({
    id: question.id ?? undefined,
    prompt: question.prompt ?? '',
    options: [...question.options],
    answerIndex: question.answerIndex ?? 0,
    explanation: question.explanation ?? '',
  }));
  const [quizQuestionsState, setQuizQuestionsState] = useState(
    initialQuizState.length
      ? initialQuizState
      : [
          {
            prompt: '',
            options: ['', '', '', ''],
            answerIndex: 0,
            explanation: '',
          },
        ]
  );

  const readingPages = useMemo(() =>
    segments
      .map((segment) => {
        const trimmedTitle = segment.title.trim();
        const trimmedContent = segment.content.trim();
        if (!trimmedTitle && !trimmedContent) {
          return null;
        }
        if (!trimmedContent) {
          return trimmedTitle;
        }
        return trimmedTitle ? `${trimmedTitle}\n\n${trimmedContent}` : trimmedContent;
      })
      .filter(Boolean),
  [segments]);
  const activitiesPreview = useMemo(
    () =>
      activitiesText
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean),
    [activitiesText]
  );

  const toggleCompetency = (value) => {
    setSelectedCompetencies((prev) => {
      const next = new Set(prev);
      if (next.has(value)) {
        next.delete(value);
      } else {
        next.add(value);
      }
      return next;
    });
  };
  const ensureOptionCount = (options) => {
    const next = [...options];
    while (next.length < 4) {
      next.push('');
    }
    return next.slice(0, 4);
  };

  const updateQuestion = (index, updater) => {
    setQuizQuestionsState((prev) =>
      prev.map((question, questionIndex) =>
        questionIndex === index ? updater(question) : question
      )
    );
  };

  const handleQuestionFieldChange = (index, field, value) => {
    updateQuestion(index, (question) => ({
      ...question,
      [field]: field === 'answerIndex' ? Number(value) : value,
    }));
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    updateQuestion(questionIndex, (question) => ({
      ...question,
      options: ensureOptionCount(question.options).map((option, currentIndex) =>
        currentIndex === optionIndex ? value : option
      ),
    }));
  };

  const handleAddQuestion = () => {
    setQuizQuestionsState((prev) => [
      ...prev,
      {
        prompt: '',
        options: ['', '', '', ''],
        answerIndex: 0,
        explanation: '',
      },
    ]);
  };

  const handleRemoveQuestion = (index) => {
    setQuizQuestionsState((prev) => prev.filter((_, questionIndex) => questionIndex !== index));
  };

  const handleAddSegment = () => {
    setSegments((prev) => [
      ...prev,
      { id: generateId('seg'), title: `Segmenti ${prev.length + 1}`, content: '' },
    ]);
  };

  const handleSegmentChange = (segmentId, field, value) => {
    setSegments((prev) =>
      prev.map((segment) =>
        segment.id === segmentId ? { ...segment, [field]: value } : segment
      )
    );
  };

  const handleRemoveSegment = (segmentId) => {
    setSegments((prev) => (prev.length > 1 ? prev.filter((segment) => segment.id !== segmentId) : prev));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const outcomes = outcomesText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    const quizQuestions = quizQuestionsState.map((question) => ({
      ...question,
      prompt: question.prompt?.trim() ?? '',
      options: ensureOptionCount(question.options)
        .map((option) => option.trim())
        .filter((option) => option),
      explanation: question.explanation?.trim() ?? '',
    }));
    const sanitizedQuizQuestions = quizQuestions
      .filter((question) => question.prompt && question.options.length >= 2)
      .map((question) => ({
        ...question,
        answerIndex: Math.min(
          Math.max(Number(question.answerIndex) || 0, 0),
          question.options.length - 1
        ),
      }));

    onSave({
      moduleId: module.id,
      subjectId,
      moduleUpdates: {
        topic: topic.trim() || module.topic,
        overview: summary.trim(),
        timeEstimate: timeEstimate.trim() || module.timeEstimate,
        reading: readingPages,
        segments: segments
          .map((segment) => ({
            id: segment.id,
            title: segment.title.trim(),
            content: segment.content.trim(),
          }))
          .filter((segment) => segment.title || segment.content),
        activities: activitiesPreview,
        quizQuestions: sanitizedQuizQuestions,
      },
      planUpdates: {
        outcomes,
        competencies: Array.from(selectedCompetencies),
        notes: planNotes.trim(),
        week: Math.min(Math.max(parseInt(week, 10) || 1, 1), 40),
      },
      lessonUpdates: {
        title: topic.trim() || module.topic,
        summary: summary.trim(),
        timeEstimate: timeEstimate.trim() || module.timeEstimate,
        activities: activitiesPreview.length,
        quizQuestions: sanitizedQuizQuestions.length,
      },
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card modal-large">
        <header>
          <h2>Menaxho literaturën</h2>
          <p>
            Përditëso tekstin, rezultatet dhe kompetencat për modulën <strong>{module.topic}</strong>.
          </p>
        </header>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="lesson-section">
            <h3>Informacioni bazë</h3>
            <label>
              Titulli i mësimit
              <input value={topic} onChange={(event) => setTopic(event.target.value)} />
            </label>

            <label>
              Përmbledhja
              <textarea
                className="field-large"
                rows={5}
                value={summary}
                onChange={(event) => setSummary(event.target.value)}
              />
            </label>

            <div className="form-inline">
              <label>
                Klasa
                <select value={module.grade} disabled>
                  {gradeOptions.map((option) => (
                    <option key={option} value={option}>
                      Klasa {option}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Koha e parashikuar
                <input value={timeEstimate} onChange={(event) => setTimeEstimate(event.target.value)} />
              </label>
              <label>
                Java e planit
                <input
                  type="number"
                  min="1"
                  max="40"
                  value={week}
                  onChange={(event) => setWeek(event.target.value)}
                />
              </label>
            </div>
          </div>

          <div className="lesson-section">
            <h3>Literatura</h3>
            {segments.map((segment, index) => (
              <article key={segment.id} className="lesson-segment">
                <div className="segment-header">
                  <label>
                    Titulli i segmentit
                    <input
                      type="text"
                      value={segment.title}
                      onChange={(event) =>
                        handleSegmentChange(segment.id, 'title', event.target.value)
                      }
                      placeholder={`p.sh. Segmenti ${index + 1}`}
                    />
                  </label>
                  {segments.length > 1 && (
                    <button
                      type="button"
                      className="secondary"
                      onClick={() => handleRemoveSegment(segment.id)}
                    >
                      Hiq segmentin
                    </button>
                  )}
                </div>
                <label>
                  Teksti i segmentit
                  <textarea
                    className="field-large"
                    rows={6}
                    value={segment.content}
                    onChange={(event) =>
                      handleSegmentChange(segment.id, 'content', event.target.value)
                    }
                    placeholder="Shkruaj tekstin e detajuar të kësaj pjese..."
                  />
                </label>
              </article>
            ))}
            <button type="button" className="secondary" onClick={handleAddSegment}>
              + Shto segment tjetër
            </button>

            <label>
              Aktivitetet (një për rresht)
              <textarea
                className="field-large"
                rows={6}
                value={activitiesText}
                onChange={(event) => setActivitiesText(event.target.value)}
              />
            </label>
          </div>

          <div className="lesson-section">
            <h3>Rezultatet & kompetencat</h3>
            <label>
              Rezultatet e të nxënit (një për rresht)
              <textarea
                className="field-large"
                rows={5}
                value={outcomesText}
                onChange={(event) => setOutcomesText(event.target.value)}
              />
            </label>

            <div className="plan-competency-grid">
              {coreCompetencies.map((competency) => {
                const active = selectedCompetencies.has(competency);
                return (
                  <button
                    key={`edit-comp-${competency}`}
                    type="button"
                    className={`plan-competency-toggle ${active ? 'plan-competency-toggle-active' : ''}`}
                    onClick={() => toggleCompetency(competency)}
                  >
                    {competency}
                  </button>
                );
              })}
            </div>

            <label>
              Shënime për planin
              <textarea
                className="field-medium"
                rows={3}
                value={planNotes}
                onChange={(event) => setPlanNotes(event.target.value)}
              />
            </label>
          </div>

          <section className="lesson-section quiz-builder">
            <h3>Kuizi i modulit</h3>
            <p className="quiz-builder-hint">
              Përditëso pyetjet e kuizit. Sigurohu që të paktën dy opsione të jenë të plotësuara për
              çdo pyetje.
            </p>
            {quizQuestionsState.map((question, questionIndex) => (
              <article key={`edit-quiz-${questionIndex}`} className="quiz-question-editor">
                <div className="question-editor-header">
                  <span>Pyetja {questionIndex + 1}</span>
                  {quizQuestionsState.length > 1 && (
                    <button
                      type="button"
                      className="secondary"
                      onClick={() => handleRemoveQuestion(questionIndex)}
                    >
                      Hiq pyetjen
                    </button>
                  )}
                </div>
                <label>
                  Prompti i pyetjes
                  <textarea
                    rows={3}
                    value={question.prompt}
                    onChange={(event) =>
                      handleQuestionFieldChange(questionIndex, 'prompt', event.target.value)
                    }
                    placeholder="Shkruaj pyetjen"
                  />
                </label>
                <div className="question-options-grid">
                  {ensureOptionCount(question.options).map((option, optionIndex) => (
                    <label key={`edit-question-${questionIndex}-option-${optionIndex}`}>
                      Opsioni {optionIndex + 1}
                      <input
                        type="text"
                        value={option}
                        onChange={(event) =>
                          handleOptionChange(questionIndex, optionIndex, event.target.value)
                        }
                      />
                    </label>
                  ))}
                </div>
                <div className="form-inline">
                  <label>
                    Përgjigjja e saktë
                    <select
                      value={question.answerIndex}
                      onChange={(event) =>
                        handleQuestionFieldChange(
                          questionIndex,
                          'answerIndex',
                          Number(event.target.value)
                        )
                      }
                    >
                      {ensureOptionCount(question.options).map((_, optionIndex) => (
                        <option key={`edit-answer-${questionIndex}-${optionIndex}`} value={optionIndex}>
                          Opsioni {optionIndex + 1}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Shpjegimi i përgjigjes
                    <textarea
                      rows={2}
                      value={question.explanation}
                      onChange={(event) =>
                        handleQuestionFieldChange(
                          questionIndex,
                          'explanation',
                          event.target.value
                        )
                      }
                      placeholder="Shpjego pse kjo është përgjigjja e saktë"
                    />
                  </label>
                </div>
              </article>
            ))}
            <button type="button" className="secondary" onClick={handleAddQuestion}>
              + Pyetje tjetër
            </button>
          </section>

          <div className="modal-actions">
            <button type="submit">Ruaj ndryshimet</button>
            <button type="button" className="secondary" onClick={onClose}>
              Anulo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LessonEditorModal;
