import { useEffect, useState } from 'react';

export function useActiveSection(ids, options = {}) {
  const [active, setActive] = useState(null);

  useEffect(() => {
    if (!ids?.length || typeof IntersectionObserver === 'undefined') return;

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!elements.length) return;

    const visible = new Map();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.intersectionRatio);
          else visible.delete(entry.target.id);
        }
        if (!visible.size) return;
        const top = [...visible.entries()].sort((a, b) => b[1] - a[1])[0][0];
        setActive(top);
      },
      {
        rootMargin: options.rootMargin ?? '-80px 0px -55% 0px',
        threshold: options.threshold ?? [0, 0.25, 0.5, 0.75, 1],
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids.join(','), options.rootMargin, options.threshold]);

  return active;
}
