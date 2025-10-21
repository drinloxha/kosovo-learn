import { findAvatar } from '../../utils/avatars';

function StudentBar({ students, activeStudentId, onSelect, onRequestAdd, canManage }) {
  return (
    <section className="student-bar">
      <div className="student-chip-list">
        {students.map((student) => {
          const isActive = student.id === activeStudentId;
          const avatar = findAvatar(student.avatarId);

          return (
            <button
              key={student.id}
              type="button"
              className={`student-chip ${isActive ? 'student-chip-active' : ''}`}
              onClick={() => onSelect(student.id)}
            >
              <span className="student-avatar" style={{ background: avatar.background }}>
                {avatar.emoji}
              </span>
              <div className="student-chip-text">
                <span className="student-name">{student.name}</span>
                <span className="student-grade">Klasa {student.grade}</span>
              </div>
            </button>
          );
        })}
        {canManage && (
          <button type="button" className="student-add-button" onClick={onRequestAdd}>
            + Nxënës i ri
          </button>
        )}
      </div>
    </section>
  );
}

export default StudentBar;
