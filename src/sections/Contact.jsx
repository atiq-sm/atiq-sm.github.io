import Reveal from '../components/Reveal.jsx';
import { site } from '../data/site.js';

export default function Contact() {
  const { github, linkedin, email } = site.links;
  return (
    <Reveal as="section" className="section">
      <div id="contact">
        <p className="section-title">Contact</p>
        <ul className="contact-list">
          {github && (
            <li>
              <a href={github} target="_blank" rel="noreferrer noopener">
                GitHub
              </a>
            </li>
          )}
          {linkedin && (
            <li>
              <a href={linkedin} target="_blank" rel="noreferrer noopener">
                LinkedIn
              </a>
            </li>
          )}
          {email && (
            <li>
              <a href={`mailto:${email}`}>{email}</a>
            </li>
          )}
        </ul>
      </div>
    </Reveal>
  );
}
