// The frame a project's dithered illustration draws into. Until the canvas
// arrives it shows a CSS dither, so the box never collapses or jumps.
export default function ProjectViz({ name, large = false }) {
  return <div className={large ? 'viz large' : 'viz'} data-viz={name} aria-hidden="true" />;
}
