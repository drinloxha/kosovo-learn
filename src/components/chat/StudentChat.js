import { useEffect, useMemo, useRef, useState } from 'react';
import { findAvatar } from '../../utils/avatars';

const SUBJECT_FALLBACK = 'Mbështetje';

function StudentChat({
  student,
  subjects,
  messages,
  onSendMessage,
  onMarkRead,
  variant = 'full',
  onClose,
  typing = false,
  onPlaySend,
  onPlayReceive,
}) {
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.name ?? SUBJECT_FALLBACK);
  const [draft, setDraft] = useState('');
  const scrollAnchorRef = useRef(null);
  const previousMessageCountRef = useRef(messages.length);
  const conversationRef = useRef(student.id);

  const subjectOptions = useMemo(() => {
    const unique = new Set([SUBJECT_FALLBACK]);
    subjects.forEach((subject) => {
      if (subject?.name) {
        unique.add(subject.name);
      }
    });
    messages.forEach((message) => {
      if (message?.subject) {
        unique.add(message.subject);
      }
    });
    return Array.from(unique);
  }, [subjects, messages]);

  useEffect(() => {
    if (!subjectOptions.length) {
      if (selectedSubject !== SUBJECT_FALLBACK) {
        setSelectedSubject(SUBJECT_FALLBACK);
      }
      return;
    }

    if (!subjectOptions.includes(selectedSubject)) {
      setSelectedSubject(subjectOptions[0]);
    }
  }, [subjectOptions, selectedSubject]);

  useEffect(() => {
    if (typeof onMarkRead !== 'function') {
      return;
    }

    const hasUnread = messages.some(
      (message) => message.sender === 'staff' && !message.readByStudent
    );

    if (hasUnread) {
      onMarkRead();
    }
  }, [messages, onMarkRead]);

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sortedMessages = useMemo(
    () =>
      [...messages].sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      ),
    [messages]
  );

  useEffect(() => {
    if (conversationRef.current !== student.id) {
      conversationRef.current = student.id;
      previousMessageCountRef.current = sortedMessages.length;
      return;
    }

    if (sortedMessages.length > previousMessageCountRef.current) {
      const latest = sortedMessages[sortedMessages.length - 1];
      if (latest?.sender === 'staff') {
        onPlayReceive?.();
      }
    }
    previousMessageCountRef.current = sortedMessages.length;
  }, [sortedMessages, onPlayReceive, student.id]);

  const formatTimestamp = (value) => {
    const formatter = new Intl.DateTimeFormat('sq-AL', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
    return formatter.format(new Date(value)).replace(',', ' •');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) {
      return;
    }
    onSendMessage(trimmed, selectedSubject);
    onPlaySend?.();
    setDraft('');
  };

  const avatar = findAvatar(student.avatarId);
  const studentMeta = (
    <div className="chat-header-identity">
      <span className="chat-header-avatar" style={{ background: avatar.background }}>
        {avatar.emoji}
      </span>
      <div className="chat-header-nameplate">
        <strong>Ndihmë online</strong>
        <span>Ekipi i stafit është aktiv</span>
      </div>
    </div>
  );

  const containerClass =
    variant === 'widget' ? 'student-chat student-chat-widget' : 'student-chat';
  const headerClass =
    variant === 'widget'
      ? 'chat-header chat-header-widget chat-header-messenger'
      : 'chat-header chat-header-messenger';

  return (
    <section className={containerClass}>
      <header className={headerClass}>
        <div className="chat-header-content">
          {studentMeta}
        </div>
        {variant === 'widget' && onClose && (
          <div className="chat-header-actions">
            <button
              type="button"
              className="chat-close"
              aria-label="Mbyll bisedën"
              onClick={onClose}
            >
              ×
            </button>
          </div>
        )}
      </header>

      <div className="chat-thread">
        {sortedMessages.length ? (
          sortedMessages.map((message) => {
            const isStudent = message.sender === 'student';
            const showAvatar = !isStudent;

            return (
              <div
                key={message.id}
                className={`chat-row ${isStudent ? 'chat-row-out' : 'chat-row-in'}`}
              >
                {showAvatar ? (
                  <div className="chat-row-avatar">
                    <span aria-hidden="true">🛟</span>
                  </div>
                ) : (
                  <div className="chat-row-spacer" />
                )}
                <div className="chat-bubble">
                  <p>{message.text}</p>
                  <span className="chat-time">{formatTimestamp(message.timestamp)}</span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="chat-empty">
            Ende nuk ka mesazhe. Zgjidh lëndën dhe nis bisedën për të marrë ndihmë.
          </div>
        )}
        {typing && (
          <div className="chat-typing" aria-live="polite">
            <span className="chat-typing-dots">
              <span className="chat-typing-dot" />
              <span className="chat-typing-dot" />
              <span className="chat-typing-dot" />
            </span>
            <span>Stafi po shkruan…</span>
          </div>
        )}
        <div ref={scrollAnchorRef} />
      </div>

      <form className="chat-input" onSubmit={handleSubmit}>
        <div className="chat-input-subject">
          <label htmlFor={`chat-subject-${student.id}`}>Tema</label>
          <select
            id={`chat-subject-${student.id}`}
            value={selectedSubject}
            onChange={(event) => setSelectedSubject(event.target.value)}
          >
            {subjectOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="chat-input-main">
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Shkruaj mesazhin..."
            rows={1}
          />
          <button type="submit" className="chat-send">
            Dërgo
          </button>
        </div>
      </form>
    </section>
  );
}

export default StudentChat;
