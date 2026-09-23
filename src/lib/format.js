// Plain formatters with no locale or timezone dependence, so the pre-rendered
// markup and the hydrated page always agree.

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function slugify(text) {
  return text
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// '2026-04-21' -> '21 Apr 2026'. Read as a calendar date, so it is never
// shifted a day by the visitor's timezone the way new Date(iso) would be.
export function formatDate(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso ?? '');
  if (!m) return null;
  return `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]}`;
}

// Age of a timestamp relative to now. Browser-only: call it after data has
// loaded, never while rendering on the server.
export function formatRelative(iso) {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return null;
  const days = Math.max(0, Math.floor((Date.now() - then) / 86_400_000));
  if (days === 0) return 'Updated today';
  if (days === 1) return 'Updated yesterday';
  if (days < 30) return `Updated ${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `Updated ${months}mo ago`;
  const years = Math.floor(days / 365);
  return `Updated ${years}y ago`;
}

// A project's anchor on /work/: its `slug` if it has one, else its title.
export function projectSlug(project) {
  return project.slug ?? slugify(project.title);
}
