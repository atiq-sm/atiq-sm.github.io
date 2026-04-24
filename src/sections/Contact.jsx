import Reveal from '../components/Reveal.jsx';
import { site } from '../data/site.js';

export default function Contact() {
  const { github, linkedin, email } = site.links;
  return (
    <Reveal as="section" id="contact" className="section section-contact">
      <div className="section-frame section-frame-contact">
        <div className="section-heading">
          <p className="section-title">Contact</p>
          <h2 className="section-kicker">Available for thoughtful product and research work.</h2>
        </div>
        <div className="contact-grid">
          <div className="contact-copy">
            <p className="contact-lede">
              If you are building something ambitious in XR, real-time systems, or
              applied AI, I&apos;d love to hear what you are working on.
            </p>
          </div>
          <ul className="contact-list">
            {email && (
              <li className="contact-item">
                <span className="contact-item-label">Email</span>
                <a href={`mailto:${email}`}>{email}</a>
              </li>
            )}
            {github && (
              <li className="contact-item">
                <span className="contact-item-label">GitHub</span>
                <a href={github} target="_blank" rel="noreferrer noopener">
                  {github.replace(/^https?:\/\//, '')}
                </a>
              </li>
            )}
            {linkedin && (
              <li className="contact-item">
                <span className="contact-item-label">LinkedIn</span>
                <a href={linkedin} target="_blank" rel="noreferrer noopener">
                  {linkedin.replace(/^https?:\/\//, '')}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </Reveal>
  );
}
