function StaffOverview({ library }) {
  return (
    <section className="staff-overview">
      <header className="section-header">
        <div>
          <h2>Përmbledhje e lëndëve</h2>
          <p>Menaxho katalogun e lëndëve dhe shiko mësimet e fundit.</p>
        </div>
      </header>
      <div className="subject-grid">
        {library.map((subject) => (
          <article key={subject.id} className="subject-card" style={{ background: subject.color }}>
            <span className="subject-icon">{subject.icon}</span>
            <h3>{subject.name}</h3>
            <p>
              {subject.description ||
                'Përdor formularin “Shto lëndë” për të përmirësuar përshkrimin.'}
            </p>
            <div className="subject-meta">
              <span>{subject.lessons.length} mësime</span>
              <span>Klasat: {subject.grades.join(', ')}</span>
            </div>
          </article>
        ))}
        {!library.length && (
          <div className="quick-empty">
            Nuk ka lëndë të regjistruara. Përdor formularin “Shto lëndë” për të filluar.
          </div>
        )}
      </div>
    </section>
  );
}

export default StaffOverview;
