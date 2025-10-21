function ModeSwitch({ mode, onChange, canAccessStaff }) {
  if (!canAccessStaff) {
    return null;
  }

  return (
    <div className="mode-switch">
      <button
        type="button"
        className={`mode-button ${mode === 'student' ? 'mode-button-active' : ''}`}
        onClick={() => onChange('student')}
      >
        Nxënës
      </button>
      <button
        type="button"
        className={`mode-button ${mode === 'staff' ? 'mode-button-active' : ''}`}
        onClick={() => onChange('staff')}
      >
        Staf
      </button>
    </div>
  );
}

export default ModeSwitch;
