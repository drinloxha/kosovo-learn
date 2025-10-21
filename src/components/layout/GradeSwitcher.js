import { gradeOptions } from '../../data/curriculum';

function GradeSwitcher({ grade, onChange, disabled }) {
  return (
    <div className="grade-switcher">
      {gradeOptions.map((option) => (
        <button
          key={option}
          type="button"
          className={`grade-pill ${grade === option ? 'grade-pill-active' : ''}`}
          onClick={() => onChange(option)}
          disabled={disabled}
        >
          Klasa {option}
        </button>
      ))}
    </div>
  );
}

export default GradeSwitcher;
