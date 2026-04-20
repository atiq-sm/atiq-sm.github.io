import { useGithubUser } from '../hooks/useGithubUser.js';

function formatYear(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.getFullYear();
}

export default function GithubStats({ username }) {
  const { data } = useGithubUser(username);
  if (!data) return null;

  const since = data.createdAt && formatYear(data.createdAt);

  return (
    <div className="gh-stats" aria-label="GitHub activity">
      <dl className="gh-stats-grid">
        <div className="gh-stat">
          <dt>Public repos</dt>
          <dd>{data.publicRepos}</dd>
        </div>
        <div className="gh-stat">
          <dt>Total stars</dt>
          <dd>{data.totalStars.toLocaleString()}</dd>
        </div>
        <div className="gh-stat">
          <dt>Followers</dt>
          <dd>{data.followers.toLocaleString()}</dd>
        </div>
        {since && (
          <div className="gh-stat">
            <dt>On GitHub since</dt>
            <dd>{since}</dd>
          </div>
        )}
      </dl>
      {data.topLanguages?.length > 0 && (
        <p className="gh-stats-langs">
          <span className="gh-stats-langs-label">Top languages:</span>{' '}
          {data.topLanguages.join(' · ')}
        </p>
      )}
    </div>
  );
}
