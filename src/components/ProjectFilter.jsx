// Toggle buttons, one per category, each with its count. The page keeps the
// state; a polite live region reads out how many projects are showing.
export default function ProjectFilter({ options, active, shown, onChange }) {
  return (
    <div className="filter">
      <div className="seg" role="group" aria-label="Filter projects by category">
        {options.map((option) => (
          <button
            key={option.key}
            type="button"
            className={active === option.key ? 'on' : undefined}
            aria-pressed={active === option.key}
            onClick={() => onChange(option.key)}
          >
            {option.label}
            <span className="count">{option.count}</span>
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {shown === 1 ? '1 project shown' : `${shown} projects shown`}
      </p>
    </div>
  );
}
