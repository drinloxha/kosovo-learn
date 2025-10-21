import { useState } from 'react';
import { gradeOptions } from '../../data/curriculum';

function AddSubjectForm({ onSubmit }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('📘');
  const [color, setColor] = useState('#eef2ff');
  const [selectedGrades, setSelectedGrades] = useState(new Set());
  const [message, setMessage] = useState('');

  const iconOptions = ['📘', '🧮', '🔬', '🌍', '✍️', '🧠', '🎨', '🚀'];
  const colorOptions = ['#eef2ff', '#dbeafe', '#dcfce7', '#fde68a', '#fee2e2', '#fae8ff', '#e0f2fe'];

  const toggleGrade = (grade) => {
    setSelectedGrades((prev) => {
      const next = new Set(prev);
      if (next.has(grade)) {
        next.delete(grade);
      } else {
        next.add(grade);
      }
      return next;
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage('');

    if (!name.trim()) {
      setMessage('Emri i lëndës është i domosdoshëm.');
      return;
    }
    if (!selectedGrades.size) {
      setMessage('Zgjidh të paktën një klasë.');
      return;
    }

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      icon,
      color,
      grades: Array.from(selectedGrades),
    });

    setName('');
    setDescription('');
    setSelectedGrades(new Set());
    setMessage('Lënda u shtua me sukses.');
  };

  return (
    <section className="staff-form">
      <header className="section-header">
        <div>
          <h2>Shto një lëndë të re</h2>
          <p>Përdor këtë formular për të ndërtuar bibliotekën e lëndëve.</p>
        </div>
      </header>

      <form className="library-form" onSubmit={handleSubmit}>
        <label>
          Emri i lëndës
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="p.sh. Teknologji informative"
          />
        </label>
        <label>
          Përshkrimi
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Përshkrim i shkurtër për këtë lëndë..."
          />
        </label>

        <div className="form-inline">
          <label>
            Ikona
            <select value={icon} onChange={(event) => setIcon(event.target.value)}>
              {iconOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label>
            Ngjyra
            <select value={color} onChange={(event) => setColor(event.target.value)}>
              {colorOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grade-selector">
          <span>Klasat e mbuluara</span>
          <div className="chip-grid">
            {gradeOptions.map((grade) => (
              <button
                key={grade}
                type="button"
                className={`chip ${selectedGrades.has(grade) ? 'chip-active' : ''}`}
                onClick={() => toggleGrade(grade)}
              >
                Klasa {grade}
              </button>
            ))}
          </div>
        </div>

        <div className="profile-actions">
          <button type="submit">Ruaj lëndën</button>
          {message && <span className="profile-message">{message}</span>}
        </div>
      </form>
    </section>
  );
}

export default AddSubjectForm;
