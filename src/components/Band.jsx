import { site } from '../data/site.js';
import Seam from './Seam.jsx';

// The closing lime field on every page; the top bar's "Get in touch" lands here.
export default function Band() {
  const { email, github, linkedin } = site.links;
  return (
    <>
      <Seam up />
      <section className="band" id="contact" aria-labelledby="contact-title">
        <h2 id="contact-title">Available for thoughtful product and research work.</h2>
        <p className="lede">
          If you are building something ambitious in XR, real-time systems or
          applied AI, I&apos;d love to hear what you are working on.
        </p>
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
