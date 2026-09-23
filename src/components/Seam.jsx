// Where lime meets ink: a three-step dither, 24px tall. `up` runs from ink into lime.
export default function Seam({ up = false }) {
  return <div className={up ? 'seam up' : 'seam'} aria-hidden="true" />;
}
