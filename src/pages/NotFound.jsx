import Hero from '../components/Hero.jsx';

export default function NotFound() {
  return (
    <Hero
      title="Nothing here."
      lede="The page you were looking for has moved or never existed."
      actions={
        <>
          <a className="btn solid" href="/">Home</a>
          <a className="btn" href="/work/">Work</a>
        </>
      }
    />
  );
}
