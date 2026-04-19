import Reveal from '../components/Reveal.jsx';
import { site } from '../data/site.js';

export default function About() {
  return (
    <Reveal as="section" className="section">
      <div id="about">
        <p className="section-title">About</p>
        <p>{site.about}</p>
      </div>
    </Reveal>
  );
}
