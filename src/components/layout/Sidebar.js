const SchoolGlyph = () => (
  <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <path
      d="M8 18.5L24 10l16 8.5v3.5L24 31 8 21.5v-3z"
      fill="url(#glyph-fill)"
      stroke="#ffffff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <path
      d="M18 24v12l6 3 6-3V24"
      stroke="#ffffff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 26l16 9 16-9"
      stroke="rgba(255,255,255,0.65)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient id="glyph-fill" x1="8" y1="10" x2="40" y2="31" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6366F1" />
        <stop offset="1" stopColor="#38BDF8" />
      </linearGradient>
    </defs>
  </svg>
);

function Sidebar({
  mode,
  isStaff,
  activeItem,
  onSelect,
  studentChatUnread = 0,
  staffChatUnread = 0,
  isMobile = false,
  isOpen = true,
  onClose,
}) {
  const studentChatLabel = studentChatUnread ? `Chat (${studentChatUnread})` : 'Chat';
  const staffChatLabel = staffChatUnread ? `Chats (${staffChatUnread})` : 'Chats';
  const studentNavItems = [
    { id: 'home', label: 'Ballina', icon: '🏠' },
    { id: 'subjects', label: 'Lëndët', icon: '📘' },
    { id: 'quizzes', label: 'Kuizet', icon: '📝' },
    { id: 'chat', label: studentChatLabel, icon: '💬' },
    { id: 'profile', label: 'Profili', icon: '👤' },
  ];

  const staffNavItems = [
    { id: 'overview', label: 'Përmbledhje', icon: '📊' },
    { id: 'lessons', label: 'Mësimet', icon: '📚' },
    { id: 'add-subject', label: 'Shto lëndë', icon: '➕' },
    { id: 'add-lesson', label: 'Shto mësim', icon: '✏️' },
    { id: 'chats', label: staffChatLabel, icon: '💬' },
  ];

  const items = mode === 'student' ? studentNavItems : staffNavItems;
  const sidebarClasses = [
    'sidebar',
    isMobile ? 'sidebar-mobile' : '',
    isMobile && isOpen ? 'sidebar-open' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <aside className={sidebarClasses} aria-hidden={isMobile && !isOpen}>
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <span className="brand-logo">
            <SchoolGlyph />
          </span>
          <div className="brand-text">
            <strong>Kosovo Learn</strong>
            <span>{isStaff ? 'Paneli i stafit' : 'Paneli i nxënësit'}</span>
          </div>
        </div>
        {isMobile && (
          <button
            type="button"
            className="sidebar-close"
            onClick={onClose}
            aria-label="Mbyll menynë kryesore"
          >
            ×
          </button>
        )}
      </div>
      <nav className="sidebar-nav">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`sidebar-item ${activeItem === item.id ? 'sidebar-item-active' : ''}`}
            onClick={() => onSelect(item.id)}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <p>
          <strong>Tip:</strong> {mode === 'student' ? 'Përfundo kuizin për çdo temë ditore.' : 'Përdor panelin për të shtuar mësime të reja.'}
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;
