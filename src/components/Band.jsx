import { site } from '../data/site.js';
import Seam from './Seam.jsx';

// The closing lime field on every page; the top bar's "Get in touch" lands here.
export default function Band() {
  const { email, github, linkedin } = site.links;
  const { title, lede } = site.cta;
  return (
    <>
      <Seam up />
      <section className="band" id="contact" aria-labelledby="contact-title">
        <h2 id="contact-title">{title}</h2>
        <p className="lede">{lede}</p>
        <div className="cta">
          <a className="btn solid" href={`mailto:${email}`}>Email me</a>
          <a className="btn" href={github} target="_blank" rel="noreferrer noopener">GitHub</a>
          <a className="btn" href={linkedin} target="_blank" rel="noreferrer noopener">LinkedIn</a>
        </div>
        <p className="fine">{email}</p>
      </section>
      <Seam />
    </>
  );
}
