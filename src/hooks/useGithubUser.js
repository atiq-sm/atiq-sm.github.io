import { useEffect, useState } from 'react';

const CACHE_PREFIX = 'gh-user:';
const CACHE_TTL_MS = 10 * 60 * 1000;

function readCache(key) {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const { at, data } = JSON.parse(raw);
    if (Date.now() - at > CACHE_TTL_MS) return null;
    return data;
  } catch {
    return null;
  }
}

function writeCache(key, data) {
  try {
    sessionStorage.setItem(key, JSON.stringify({ at: Date.now(), data }));
  } catch {}
}

async function fetchStats(username, signal) {
  const headers = { Accept: 'application/vnd.github+json' };
  const userRes = await fetch(`https://api.github.com/users/${username}`, {
    signal,
    headers,
  });
  if (!userRes.ok) throw new Error(`HTTP ${userRes.status}`);
  const user = await userRes.json();

  const reposRes = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100&type=owner&sort=updated`,
    { signal, headers },
  );
  if (!reposRes.ok) throw new Error(`HTTP ${reposRes.status}`);
  const repos = await reposRes.json();

  const ownRepos = repos.filter((r) => !r.fork);
  const totalStars = ownRepos.reduce(
    (acc, r) => acc + (r.stargazers_count ?? 0),
    0,
  );
  const languages = new Map();
  for (const r of ownRepos) {
    if (!r.language) continue;
    languages.set(r.language, (languages.get(r.language) ?? 0) + 1);
  }
  const topLanguages = [...languages.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name]) => name);

  return {
    publicRepos: ownRepos.length,
    totalStars,
    followers: user.followers ?? 0,
    createdAt: user.created_at ?? null,
    htmlUrl: user.html_url ?? `https://github.com/${username}`,
    topLanguages,
  };
}

export function useGithubUser(username) {
  const [state, setState] = useState({ data: null, error: null });

  useEffect(() => {
    if (!username) {
      setState({ data: null, error: null });
      return;
    }
    const key = `${CACHE_PREFIX}${username}`;
    const cached = readCache(key);
    if (cached) {
      setState({ data: cached, error: null });
      return;
    }
    setState({ data: null, error: null });
    const controller = new AbortController();
    fetchStats(username, controller.signal)
      .then((data) => {
        writeCache(key, data);
        setState({ data, error: null });
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setState({ data: null, error: err });
      });
    return () => controller.abort();
  }, [username]);

  return state;
}
