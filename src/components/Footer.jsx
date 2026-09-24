import { site } from '../data/site.js';

// The same three columns on every page.
export default function Footer() {
  const { email, github, linkedin, source } = site.links;
  return (
    <footer>
      <div className="cols3">
        <p>
          <b>{site.name}</b>. XR engineer in {site.location}.
        </p>
        <p>
          <a href={`mailto:${email}`}>Email</a>,{' '}
          <a href={github} target="_blank" rel="noreferrer noopener">GitHub</a>,{' '}
          <a href={linkedin} target="_blank" rel="noreferrer noopener">LinkedIn</a>.
        </p>
        <p>
          © {__BUILD_YEAR__}. Built with React and Vite.{' '}
          <a href={source} target="_blank" rel="noreferrer noopener">Source</a>.
        </p>
      </div>
    </footer>
  );
}
