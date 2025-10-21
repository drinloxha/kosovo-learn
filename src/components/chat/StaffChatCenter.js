import { useEffect, useMemo, useRef, useState } from 'react';
import { curriculum } from '../../data/curriculum';
import { countUnreadMessages } from '../../utils/chat';
import { findAvatar } from '../../utils/avatars';

const SUBJECT_FALLBACK = 'Mbështetje';

function StaffChatCenter({
  students,
  chats,
  activeStudentId,
  onSelectStudent,
  onSendMessage,
  onMarkRead,
  variant = 'full',
  onClose,
  typingStatus = {},
  onPlaySend,
  onPlayReceive,
}) {
  const activeStudent =
    students.find((student) => student.id === activeStudentId) ?? students[0] ?? null;
  const messages = useMemo(
    () => (activeStudent ? chats[activeStudent.id] ?? [] : []),
    [activeStudent, chats]
  );
  const [selectedSubject, setSelectedSubject] = useState(SUBJECT_FALLBACK);
  const [draft, setDraft] = useState('');
  const scrollAnchorRef = useRef(null);
  const previousMessageCountRef = useRef(messages.length);
  const conversationRef = useRef(activeStudentId);

  const activeStudentAvatar = useMemo(
    () => (activeStudent ? findAvatar(activeStudent.avatarId) : null),
    [activeStudent]
  );
  const typing = activeStudent ? Boolean(typingStatus[activeStudent.id]) : false;

  useEffect(() => {
    setDraft('');
  }, [activeStudentId]);

  const subjectOptions = useMemo(() => {
    const unique = new Set([SUBJECT_FALLBACK]);

    if (activeStudent) {
      const plan = curriculum[activeStudent.grade];
      plan?.modules?.forEach((module) => {
        if (module.subject) {
          unique.add(module.subject);
        }
      });

      messages.forEach((message) => {
        if (message?.subject) {
          unique.add(message.subject);
        }
      });
    }

    return Array.from(unique);
  }, [activeStudent, messages]);

  useEffect(() => {
    if (!subjectOptions.length) {
      setSelectedSubject(SUBJECT_FALLBACK);
      return;
    }

    setSelectedSubject((prev) =>
      subjectOptions.includes(prev) ? prev : subjectOptions[0]
    );
  }, [subjectOptions]);

  useEffect(() => {
    if (!activeStudent || typeof onMarkRead !== 'function') {
      return;
    }

    const hasUnread = messages.some(
      (message) => message.sender === 'student' && !message.readByStaff
    );

    if (hasUnread) {
      onMarkRead(activeStudent.id);
    }
  }, [activeStudent, messages, onMarkRead]);

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeStudentId, variant]);

  const sortedMessages = useMemo(
    () =>
      [...messages].sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      ),
    [messages]
  );

  useEffect(() => {
    if (conversationRef.current !== activeStudentId) {
      conversationRef.current = activeStudentId;
      previousMessageCountRef.current = sortedMessages.length;
      return;
    }

    if (sortedMessages.length > previousMessageCountRef.current) {
      const latest = sortedMessages[sortedMessages.length - 1];
      if (latest?.sender === 'student') {
        onPlayReceive?.();
      }
    }
    previousMessageCountRef.current = sortedMessages.length;
  }, [sortedMessages, onPlayReceive, activeStudentId]);

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
    if (!activeStudent) {
      return;
    }

    const trimmed = draft.trim();
    if (!trimmed) {
      return;
    }

    onSendMessage(activeStudent.id, trimmed, selectedSubject);
    onPlaySend?.();
    setDraft('');
  };

  const studentBadgeFull =
    activeStudent &&
    activeStudentAvatar && (
      <div className="chat-header-identity">
        <span className="chat-header-avatar" style={{ background: activeStudentAvatar.background }}>
          {activeStudentAvatar.emoji}
        </span>
        <div className="chat-header-nameplate">
          <strong>{activeStudent.name}</strong>
          <span>{activeStudent.email}</span>
        </div>
      </div>
    );

  const studentBadgeWidget =
    activeStudent &&
    activeStudentAvatar && (
      <div className="chat-header-identity">
        <span className="chat-header-avatar" style={{ background: activeStudentAvatar.background }}>
          {activeStudentAvatar.emoji}
        </span>
        <div className="chat-header-nameplate">
          <strong>{activeStudent.name}</strong>
          <span>Klasa {activeStudent.grade}</span>
        </div>
      </div>
    );

  const thread = (
    <div className="chat-thread">
      {sortedMessages.length ? (
        sortedMessages.map((message) => {
          const isStudent = message.sender === 'student';
          const authorAvatar = isStudent
            ? activeStudentAvatar
              ? { symbol: activeStudentAvatar.emoji, background: activeStudentAvatar.background }
              : { symbol: '👤', background: '#64748b' }
            : { symbol: '🛟', background: '#4338ca' };
          const showAvatar = !isStudent;
          return (
            <div
              key={message.id}
              className={`chat-row ${isStudent ? 'chat-row-out' : 'chat-row-in'}`}
            >
              {showAvatar ? (
                <div className="chat-row-avatar" style={{ background: authorAvatar.background }}>
                  <span aria-hidden="true">{authorAvatar.symbol}</span>
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
          Nuk ka mesazhe ende. Dërgo mesazhin e parë për të përshëndetur nxënësin.
        </div>
      )}
      {typing && (
        <div className="chat-typing" aria-live="polite">
          <span className="chat-typing-dots">
            <span className="chat-typing-dot" />
            <span className="chat-typing-dot" />
            <span className="chat-typing-dot" />
          </span>
          <span>Nxënësi po shkruan…</span>
        </div>
      )}
      <div ref={scrollAnchorRef} />
    </div>
  );

  const composer = (
    <form className="chat-input" onSubmit={handleSubmit}>
      <div className="chat-input-subject">
        <label htmlFor={`staff-chat-subject-${activeStudent?.id ?? 'none'}`}>Tema</label>
        <select
          id={`staff-chat-subject-${activeStudent?.id ?? 'none'}`}
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
          placeholder="Shkruaj përgjigjen..."
          rows={1}
        />
        <button type="submit" className="chat-send">
          Dërgo
        </button>
      </div>
    </form>
  );

  if (variant === 'widget') {
    const activeStudentValue = activeStudent ? activeStudent.id : '';
    return (
      <section className="staff-chat staff-chat-widget">
        <header className="chat-header chat-header-widget chat-header-messenger">
          <div className="chat-header-content">
            <div>
              <h3>Mesazhet e nxënësve</h3>
              <p>Përgjigju shpejt nga çdo ekran.</p>
            </div>
            <div className="chat-header-actions">
              {students.length > 1 && (
                <select
                  value={activeStudentValue}
                  onChange={(event) => onSelectStudent(event.target.value)}
                >
                  {students.map((student) => {
                    const unread = countUnreadMessages(chats[student.id] ?? [], 'staff');
                    const label = unread ? `${student.name} (${unread})` : student.name;
                    return (
                      <option key={student.id} value={student.id}>
                        {label}
                      </option>
                    );
                  })}
                </select>
              )}
              {onClose && (
                <button
                  type="button"
                  className="chat-close"
                  aria-label="Mbyll bisedat"
                  onClick={onClose}
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </header>
        {activeStudent ? (
          <>
            {studentBadgeWidget}
            {thread}
            {composer}
          </>
        ) : (
          <div className="chat-empty staff-chat-placeholder">
            Zgjidh një nxënës nga lista për të nisur bisedën.
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="staff-chat">
      <aside className="staff-chat-sidebar">
        <header className="chat-header chat-header-muted">
          <div className="chat-header-content">
            <div>
              <h2>Live chat</h2>
              <p>Menaxho bisedat e nxënësve dhe kthe përgjigje menjëherë.</p>
            </div>
          </div>
        </header>
        <div className="staff-chat-list">
          {students.map((student) => {
            const avatar = findAvatar(student.avatarId);
            const studentMessages = chats[student.id] ?? [];
            const unread = countUnreadMessages(studentMessages, 'staff');
            const isActive = activeStudent && student.id === activeStudent.id;
            const isTyping = Boolean(typingStatus[student.id]);

            return (
              <button
                key={student.id}
                type="button"
                className={`staff-chat-item ${isActive ? 'staff-chat-item-active' : ''}`}
                onClick={() => onSelectStudent(student.id)}
              >
                <div className="staff-chat-item-info">
                  <span className="student-avatar" style={{ background: avatar.background }}>
                    {avatar.emoji}
                  </span>
                  <div className="staff-chat-item-text">
                    <strong>{student.name}</strong>
                    <span className="staff-chat-item-grade">Klasa {student.grade}</span>
                    {isTyping && (
                      <span className="chat-status chat-status-inline">
                        <span className="chat-status-dot chat-status-online" />
                        Duke u përgjigjur...
                      </span>
                    )}
                  </div>
                </div>
                {unread > 0 && <span className="staff-chat-badge">{unread}</span>}
              </button>
            );
          })}
          {!students.length && (
            <div className="chat-empty">Nuk ka nxënës të regjistruar për momentin.</div>
          )}
        </div>
      </aside>

      <div className="staff-chat-pane">
        {activeStudent ? (
          <>
            <div className="chat-header chat-header-messenger">
              <div className="chat-header-content">
                <div>
                  <h3>{activeStudent.name}</h3>
                  <p>
                    Shkruaj përgjigje të dobishme dhe shënoji mesazhet si të lexuara për të mbajtur
                    rend.
                  </p>
                </div>
              </div>
              {studentBadgeFull}
            </div>
            {thread}
            {composer}
          </>
        ) : (
          <div className="chat-empty staff-chat-placeholder">
            Zgjidh një nxënës nga lista për të parë bisedën.
          </div>
        )}
      </div>
    </section>
  );
}

export default StaffChatCenter;
