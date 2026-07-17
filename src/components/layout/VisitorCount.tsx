'use client';

import { useEffect, useState } from 'react';

/** Footer visitor counter — hides itself unless /api/visitors returns a number. */
export default function VisitorCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/visitors', { method: 'POST' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d && typeof d.count === 'number') setCount(d.count);
      })
      .catch(() => {});
  }, []);

  if (count === null) return null;
  return <span className="text-xs text-muted-foreground">{count.toLocaleString()} visits</span>;
}
