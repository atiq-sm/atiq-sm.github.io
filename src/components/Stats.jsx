// Four numbers under the headline, each over a one-line caption, split by ink rules.
export default function Stats({ items }) {
  return (
    <div className="stats">
      {items.map((stat) => (
        <div key={stat.value}>
          <b>{stat.value}</b>
          <span>{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
