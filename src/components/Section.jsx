// A section opens with its heading on columns 1-7 and its lead and actions on
// 8-12, bottoms aligned. Without an aside the heading takes the full width.
export default function Section({ id, title, aside, className, children }) {
  return (
    <section id={id} className={className ? `block ${className}` : 'block'}>
      {title && (
        <div className="head">
          <h2>{title}</h2>
          {aside && <div className="aside">{aside}</div>}
        </div>
      )}
      {children}
    </section>
  );
}
