// One row per role: when on the left, what in the middle, where on the right.
// `detailed` adds each role's bullets, for the About page.
export default function Timeline({ items, detailed = false }) {
  return (
    <ol className={detailed ? 'timeline detailed' : 'timeline'}>
      {items.map((job) => (
        <li key={`${job.company}-${job.period}`}>
          <p className="period">{job.period}</p>
          <div className="what">
            <h3>{job.role}</h3>
            <p>{job.company}</p>
            {detailed && job.bullets?.length > 0 && (
              <ul>
                {job.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            )}
          </div>
          {job.location && <p className="where">{job.location}</p>}
        </li>
      ))}
    </ol>
  );
}
