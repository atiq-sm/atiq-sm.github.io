import { site } from '../data/site.js';

export default function About() {
  return (
    <section id="about" className="section">
      <p className="section-title">About</p>
      <p>{site.about}</p>
    </section>
  );
}
