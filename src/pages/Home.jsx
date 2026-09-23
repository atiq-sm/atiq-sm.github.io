import { site } from '../data/site.js';
import Hero from '../components/Hero.jsx';

export default function Home() {
  return (
    <Hero
      title="Real-time systems that ship."
      lede={site.intro.lede}
      fine={site.intro.fine}
      actions={
        <>
          <a className="btn solid" href="/work/">See the work</a>
          <a className="btn" href="/about/">About me</a>
        </>
      }
    />
  );
}
