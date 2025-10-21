import { useState } from 'react';
import { gradeOptions } from '../../data/curriculum';
import { coreCompetencies } from '../../data/competencies';
import { generateId } from '../../utils/identifiers';

function AddLessonForm({ library, onSubmit }) {
  const [subjectId, setSubjectId] = useState(library[0]?.id ?? '');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [grade, setGrade] = useState(gradeOptions[0]);
  const [timeEstimate, setTimeEstimate] = useState('20 min');
  const [activityDetails, setActivityDetails] = useState('');
  const [week, setWeek] = useState(1);
  const [outcomesText, setOutcomesText] = useState('');
  const [planNotes, setPlanNotes] = useState('');
  const [selectedCompetencies, setSelectedCompetencies] = useState(() => new Set());
  const [segments, setSegments] = useState([
    { id: generateId('seg'), title: 'Hyrje', content: '' },
  ]);
  const [quizQuestionsState, setQuizQuestionsState] = useState([
    {
      prompt: '',
      options: ['', '', '', ''],
      answerIndex: 0,
      explanation: '',
    },
  ]);
  const [message, setMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage('');

    if (!subjectId) {
      setMessage('Zgjidh fillimisht lëndën.');
      return;
    }

    if (!title.trim()) {
      setMessage('Titulli i mësimit është i domosdoshëm.');
      return;
    }

    const normalizedWeek = Math.min(Math.max(parseInt(week, 10) || 1, 1), 40);

    const outcomes = outcomesText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    const readingItems = segments
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
      .filter(Boolean);
    const activityItems = activityDetails
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
  const preparedQuizQuestions = quizQuestionsState
    .map((question) => ({
      ...question,
      prompt: question.prompt.trim(),
      options: question.options.map((option) => option.trim()).filter((option) => option),
      explanation: question.explanation.trim(),
    }))
    .filter((question) => question.prompt && question.options.length >= 2)
    .map((question) => ({
      ...question,
      answerIndex: Math.min(
        Math.max(Number(question.answerIndex) || 0, 0),
        question.options.length - 1
      ),
    }));

    onSubmit(subjectId, {
      title: title.trim(),
      summary: summary.trim(),
      grade,
      timeEstimate: timeEstimate.trim() || '20 min',
      activities: activityItems.length,
      reading: readingItems,
      activityDetails: activityItems,
      segments: segments
        .map((segment) => ({
          id: segment.id,
          title: segment.title.trim(),
          content: segment.content.trim(),
        }))
        .filter((segment) => segment.title || segment.content),
      week: normalizedWeek,
      outcomes,
      competencies: Array.from(selectedCompetencies),
      planNotes: planNotes.trim(),
      quizQuestions: preparedQuizQuestions,
    });

    setTitle('');
    setSummary('');
    setSegments([{ id: generateId('seg'), title: 'Hyrje', content: '' }]);
    setActivityDetails('');
    setOutcomesText('');
    setPlanNotes('');
    setWeek(1);
    setSelectedCompetencies(new Set());
    setQuizQuestionsState([
      {
        prompt: '',
        options: ['', '', '', ''],
        answerIndex: 0,
        explanation: '',
      },
    ]);
    setMessage('Mësimi u shtua me sukses.');
  };

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

  const updateQuestion = (index, updater) => {
    setQuizQuestionsState((prev) =>
      prev.map((question, questionIndex) =>
        questionIndex === index ? updater(question) : question
      )
    );
  };

  const ensureOptionCount = (options) => {
    const next = [...options];
    while (next.length < 4) {
      next.push('');
    }
    return next.slice(0, 4);
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

  return (
    <section className="staff-form">
      <header className="section-header">
        <div>
          <h2>Shto një mësim të ri</h2>
          <p>Lidh mësimin me lëndën dhe klasën përkatëse.</p>
        </div>
      </header>

      <form className="library-form" onSubmit={handleSubmit}>
        <div className="lesson-section">
          <h3>Informacioni bazë</h3>
          <label>
            Lënda
            <select value={subjectId} onChange={(event) => setSubjectId(event.target.value)}>
              {library.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Titulli i mësimit
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="p.sh. Energjia potenciale"
            />
          </label>

          <label>
            Përmbledhja
            <textarea
              className="field-large"
              rows={5}
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              placeholder="Përshkrim i plotë i orës – çfarë duhet të arrijnë nxënësit?"
            />
          </label>

          <div className="form-inline">
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
              Koha e parashikuar
              <input
                type="text"
                value={timeEstimate}
                onChange={(event) => setTimeEstimate(event.target.value)}
              />
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
          <h3>Literatura kryesore</h3>
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
        </div>

        <div className="lesson-section">
          <h3>Aktivitete & rezultate</h3>
          <label>
            Aktivitetet (një për rresht)
            <textarea
              className="field-large"
              rows={6}
              value={activityDetails}
              onChange={(event) => setActivityDetails(event.target.value)}
              placeholder="p.sh. Ushtrim me grupe, diskutim kritik..."
            />
          </label>

          <label>
            Rezultatet e të nxënit (një për rresht)
            <textarea
              className="field-large"
              rows={5}
              value={outcomesText}
              onChange={(event) => setOutcomesText(event.target.value)}
              placeholder="p.sh. Nxënësi analizon dallimet mes..."
            />
          </label>

          <div className="plan-competency-grid">
            {coreCompetencies.map((option) => {
              const active = selectedCompetencies.has(option);
              return (
                <button
                  key={`lesson-comp-${option}`}
                  type="button"
                  className={`plan-competency-toggle ${active ? 'plan-competency-toggle-active' : ''}`}
                  onClick={() => toggleCompetency(option)}
                >
                  {option}
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
              placeholder="Instruksione, evidenca ose materiale shtesë për mentorët."
            />
          </label>
        </div>

        <section className="lesson-section quiz-builder">
          <h3>Kuizi i modulit</h3>
          <p className="quiz-builder-hint">
            Plotëso pyetjet e kuizit. Çdo pyetje duhet të ketë të paktën dy opsione. Opsioni i saktë
            zgjidhet nga lista “Përgjigjja e saktë”.
          </p>
          {quizQuestionsState.map((question, questionIndex) => (
            <article key={`quiz-question-${questionIndex}`} className="quiz-question-editor">
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
                  placeholder="Shkruaj pyetjen që do t’ia paraqesësh nxënësit"
                />
              </label>
              <div className="question-options-grid">
                {ensureOptionCount(question.options).map((option, optionIndex) => (
                  <label key={`question-${questionIndex}-option-${optionIndex}`}>
                    Opsioni {optionIndex + 1}
                    <input
                      type="text"
                      value={option}
                      onChange={(event) =>
                        handleOptionChange(questionIndex, optionIndex, event.target.value)
                      }
                      placeholder="Shkruaj opsionin"
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
                      <option key={`answer-${questionIndex}-${optionIndex}`} value={optionIndex}>
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
                      handleQuestionFieldChange(questionIndex, 'explanation', event.target.value)
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

        <div className="profile-actions">
          <button type="submit">Ruaj mësimin</button>
          {message && <span className="profile-message">{message}</span>}
        </div>
      </form>
    </section>
  );
}

export default AddLessonForm;
