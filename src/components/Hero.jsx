import Seam from './Seam.jsx';

// The page head: one left-aligned lime field, then a seam into ink.
// `compact` puts the headline and lede side by side, for the inner pages.
export default function Hero({ title, lede, actions, fine, compact = false, children }) {
  if (compact) {
    return (
      <>
        <section className="hero compact">
          <div className="head">
            <h1>{title}</h1>
            {lede && <p className="lede">{lede}</p>}
          </div>
        </section>
        <Seam />
      </>
    );
  }

  return (
    <>
      <section className="hero">
        <h1>{title}</h1>
        {(lede || actions || fine) && (
          <div className="g12 hero-row">
            <div className="hero-main">
              {lede && <p className="lede">{lede}</p>}
              {actions && <div className="cta">{actions}</div>}
            </div>
            {fine && <p className="fine">{fine}</p>}
          </div>
        )}
        {children}
      </section>
      <Seam />
    </>
  );
}
