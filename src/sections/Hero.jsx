import { site } from '../data/site.js';

export default function Hero() {
  return (
    <section className="hero">
      <h1>{site.name}</h1>
      <p>{site.tagline}</p>
      <a className="button" href="#projects">
        See my work
      </a>
    </section>
  );
}
