'use client';

import { Command } from 'cmdk';
import { ArrowUpRight, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Kbd } from '@/components/ui/kbd';
import type { SearchEntry } from '@/lib/data';

/**
 * Case-insensitive fuzzy match: every query character must appear in order.
 * Scores contiguous runs, word starts, and exact substrings higher.
 * Returns -1 for no match.
 */
function fuzzyScore(query: string, haystack: string): number {
  const q = query.toLowerCase();
  const h = haystack.toLowerCase();
  if (!q) return 0;
  const sub = h.indexOf(q);
  if (sub !== -1) return 1000 - sub; // exact substring wins
  let score = 0;
  let hi = 0;
  let streak = 0;
  for (const ch of q) {
    const found = h.indexOf(ch, hi);
    if (found === -1) return -1;
    streak = found === hi ? streak + 1 : 1;
    score += streak * 3 + (found === 0 || h[found - 1] === ' ' ? 5 : 0) - Math.min(found - hi, 10);
    hi = found + 1;
  }
  return score;
}

/**
 * Global command palette (reference ⌘K dialog UI) — searches every content
 * category via the build-time index from the data layer.
 */
export default function SearchDialog({ index }: { index: SearchEntry[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [isMac, setIsMac] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setIsMac(!/windows|linux/i.test(navigator.userAgent));
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const categories = useMemo(() => [...new Set(index.map((e) => e.category))], [index]);

  const results = useMemo(() => {
    const pool = category ? index.filter((e) => e.category === category) : index;
    const q = query.trim();
    const scored = pool
      .map((entry) => ({
        entry,
        score: q ? fuzzyScore(q, `${entry.title} ${entry.subtitle} ${entry.keywords}`) : 0,
      }))
      .filter((r) => r.score >= 0)
      .sort((a, b) => b.score - a.score);
    const grouped = new Map<string, SearchEntry[]>();
    for (const { entry } of scored) {
      const list = grouped.get(entry.category) ?? [];
      if (list.length < 8) list.push(entry);
      grouped.set(entry.category, list);
    }
    return grouped;
  }, [index, query, category]);

  const total = [...results.values()].reduce((n, list) => n + list.length, 0);

  // cmdk fires onSelect on both click and Enter-on-highlighted. We navigate
  // explicitly (router.push / window.open) so it never depends on a Link's
  // synthetic click behavior.
  const navigate = useCallback(
    (href: string, external: boolean) => {
      setOpen(false);
      if (external) window.open(href, '_blank', 'noopener,noreferrer');
      else router.push(href);
    },
    [router],
  );

  return (
    <>
      <Button variant="outline" size="sm" aria-label="Search" onClick={() => setOpen(true)} className="gap-1.5">
        <Search className="size-4" />
        <span className="hidden items-center gap-0.5 sm:inline-flex">
          <Kbd>{isMac ? '⌘' : 'Ctrl'}</Kbd>
          <Kbd>K</Kbd>
        </span>
      </Button>

      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        shouldFilter={false}
        label="Search"
        className="fixed top-[20%] left-1/2 z-50 w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 overflow-hidden rounded-md bg-background text-sm shadow-lg ring-1 ring-foreground/10 outline-none"
      >
        <div className="border-b border-border px-3 py-2.5">
          <div className="flex items-center justify-between gap-2">
            <p className="font-medium">Search</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground"
            >
              ESC
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Fuzzy search across pages, projects, blogs, experience, and everything else
          </p>
        </div>
        <Command.Input
          value={query}
          onValueChange={setQuery}
          placeholder="Search anything"
          className="w-full border-b border-border bg-transparent px-3 py-2.5 outline-none placeholder:text-muted-foreground"
        />
        <Command.List className="max-h-72 overflow-y-auto p-2">
          {total === 0 ? <p className="py-6 text-center text-muted-foreground">No results found.</p> : null}
          {[...results.entries()].map(([group, entries]) => (
            <Command.Group
              key={group}
              heading={group}
              className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground"
            >
              {entries.map((entry) => (
                <Command.Item
                  key={`${entry.category}-${entry.title}-${entry.href}`}
                  value={`${entry.category}-${entry.title}-${entry.href}`}
                  onSelect={() => navigate(entry.href, entry.external)}
                  className="flex cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-2 data-[selected=true]:bg-muted"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{entry.title}</span>
                    {entry.subtitle ? (
                      <span className="block truncate text-xs text-muted-foreground">{entry.subtitle}</span>
                    ) : null}
                  </span>
                  {entry.external ? (
                    <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                  ) : null}
                </Command.Item>
              ))}
            </Command.Group>
          ))}
        </Command.List>
        <div className="flex flex-wrap items-center gap-1.5 border-t border-border px-3 py-2">
          <span className="text-xs text-muted-foreground">Filter</span>
          <button
            type="button"
            onClick={() => setCategory(null)}
            className={`rounded-md px-2 py-0.5 text-xs ${category === null ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(category === c ? null : c)}
              className={`rounded-md px-2 py-0.5 text-xs ${category === c ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
            >
              {c}
            </button>
          ))}
        </div>
      </Command.Dialog>
    </>
  );
}
