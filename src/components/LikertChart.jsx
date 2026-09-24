// Two series as paired bars per row, the first in lime and the second dithered.
// The bars are drawn for sight; the table under them carries the same numbers
// for screen readers.
export default function LikertChart({ caption, series, max, rows }) {
  return (
    <figure className="chart">
      <p className="legend" aria-hidden="true">
        <span className="key a" /> {series[0]} <span className="key b" /> {series[1]}
      </p>
      <div className="bars" aria-hidden="true">
        {rows.map(([label, a, b]) => (
          <div key={label} className="bar-row">
            <span className="bar-label">{label}</span>
            <span className="bar a" style={{ width: `${((a / max) * 100).toFixed(2)}%` }}>
              <b>{a}</b>
            </span>
            <span className="bar b" style={{ width: `${((b / max) * 100).toFixed(2)}%` }}>
              <b>{b}</b>
            </span>
          </div>
        ))}
      </div>
      <div className="sr-only">
        <table>
          <caption>{caption}</caption>
          <thead>
            <tr>
              <th scope="col">Domain</th>
              <th scope="col">{series[0]}</th>
              <th scope="col">{series[1]}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, a, b]) => (
              <tr key={label}>
                <th scope="row">{label}</th>
                <td>{a} of {max}</td>
                <td>{b} of {max}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <figcaption className="fine" aria-hidden="true">{caption}</figcaption>
    </figure>
  );
}
