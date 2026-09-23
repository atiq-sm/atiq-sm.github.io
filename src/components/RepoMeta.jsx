import { parseGithubRepo, useGithubRepo } from '../hooks/useGithubRepo.js';
import { formatRelative } from '../lib/format.js';

// Live language, stars and last push for a GitHub repo. The line keeps its
// height while loading (and in the pre-rendered page), so nothing below moves.
export default function RepoMeta({ href }) {
  const parsed = parseGithubRepo(href);
  const { data } = useGithubRepo(parsed?.owner, parsed?.repo);
  if (!parsed) return null;

  const pieces = [];
  if (data?.language) pieces.push({ key: 'lang', node: data.language });
  if (data?.stars > 0) {
    pieces.push({
      key: 'stars',
      node: (
        <>
          <span aria-hidden="true">★ </span>
          {data.stars.toLocaleString('en-US')}
          <span className="sr-only"> stars</span>
        </>
      ),
    });
  }
  const rel = data?.pushedAt && formatRelative(data.pushedAt);
  if (rel) pieces.push({ key: 'rel', node: rel });

  return (
    <p className="repo-meta">
      {pieces.map((p) => (
        <span key={p.key}>{p.node}</span>
      ))}
    </p>
  );
}
