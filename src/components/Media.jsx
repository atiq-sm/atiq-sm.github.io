// A figure: a photo or a recording with its caption. Images carry their size so
// the page doesn't shift as they load; a video never plays until it is asked to.
export function Figure({ src, width, height, alt, caption, eager = false }) {
  return (
    <figure className="shot">
      <img src={src} width={width} height={height} alt={alt} loading={eager ? undefined : 'lazy'} decoding="async" />
      {caption && <figcaption className="fine">{caption}</figcaption>}
    </figure>
  );
}

export function Video({ src, poster, width, height, label, caption }) {
  return (
    <figure className="shot">
      <video controls playsInline preload="metadata" poster={poster} width={width} height={height} aria-label={label}>
        <source src={src} type="video/mp4" />
      </video>
      {caption && <figcaption className="fine">{caption}</figcaption>}
    </figure>
  );
}
