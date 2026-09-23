import { useEffect, useState } from 'react';

const CACHE_PREFIX = 'gh-repos:';
const CACHE_TTL_MS = 30 * 60 * 1000;
const RETRY_AFTER_MS = 5 * 60 * 1000;

export function parseGithubRepo(url) {
  if (typeof url !== 'string') return null;
  const m = url.match(/^https?:\/\/github\.com\/([^/]+)\/([^/#?]+)/i);
  if (!m) return null;
  return { owner: m[1], repo: m[2].replace(/\.git$/, '') };
}

function readCache(key) {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const entry = JSON.parse(raw);
    if (entry.failedUntil) return entry.failedUntil > Date.now() ? entry : null;
    return Date.now() - entry.at > CACHE_TTL_MS ? null : entry;
  } catch {
    return null;
  }
}

function writeCache(key, entry) {
  try {
    sessionStorage.setItem(key, JSON.stringify(entry));
  } catch {}
}

// One request per owner, shared by every card on the page. The unauthenticated
// API allows 60 calls an hour per IP, so a whole page costs one of them.
const requests = new Map();

function loadRepos(owner) {
  const key = `${CACHE_PREFIX}${owner.toLowerCase()}`;
  if (requests.has(key)) return requests.get(key);

  const cached = readCache(key);
  const request = cached
    ? Promise.resolve(cached.repos ?? null)
    : fetch(`https://api.github.com/users/${owner}/repos?per_page=100&type=owner&sort=pushed`, {
        headers: { Accept: 'application/vnd.github+json' },
      })
        .then((r) => {
          if (r.ok) return r.json();
          // A rate-limited response says when the limit resets; wait until then.
          const reset = Number(r.headers.get('x-ratelimit-reset')) * 1000;
          const error = new Error(`HTTP ${r.status}`);
          error.retryAt = reset > Date.now() ? reset : 0;
          throw error;
        })
        .then((list) => {
          // Keep only what the cards show: the full response is ~5 KB per repo.
          const repos = {};
          for (const repo of list) {
            repos[repo.name.toLowerCase()] = {
              stars: repo.stargazers_count ?? 0,
              language: repo.language ?? null,
              pushedAt: repo.pushed_at ?? null,
            };
          }
          writeCache(key, { at: Date.now(), repos });
          return repos;
        })
        .catch((err) => {
          writeCache(key, { failedUntil: err.retryAt || Date.now() + RETRY_AFTER_MS });
          return null;
        });

  requests.set(key, request);
  return request;
}

// Language, stars and last push for one repo, or null until (or unless) the
// owner's repo list arrives. Browser-only: nothing runs during pre-rendering.
export function useGithubRepo(owner, repo) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!owner || !repo) {
      setData(null);
      return;
    }
    let live = true;
    // The shared request is never aborted; a card that unmounts ignores it.
    loadRepos(owner).then((repos) => {
      if (live) setData(repos?.[repo.toLowerCase()] ?? null);
    });
    return () => {
      live = false;
    };
  }, [owner, repo]);

  return { data };
}
