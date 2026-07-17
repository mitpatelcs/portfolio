'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import { formatPostDate } from '@/lib/utils';

export type BlogListPost = {
  slug: string;
  title: string;
  description?: string;
  date: string;
  tags: string[];
  /** External source (e.g. LinkedIn). When set, the card opens it in a new tab. */
  sourceUrl?: string;
};

const MAX_VISIBLE_TAGS = 2;

/** Reference blog list: category chips with counts filter the post list client-side. */
export default function BlogList({
  posts,
  categories,
}: {
  posts: BlogListPost[];
  categories: { name: string; count: number }[];
}) {
  const [active, setActive] = useState<string | null>(null);
  const visible = useMemo(
    () => (active ? posts.filter((p) => p.tags.includes(active)) : posts),
    [posts, active],
  );

  return (
    <>
      {/* "All" is always shown; per-category chips only appear once there is more
          than one category. A single-platform list therefore shows just "All"
          (no redundant per-platform chip), with the design otherwise unchanged. */}
      <div className="animate-in-up flex flex-wrap gap-2" style={{ animationDelay: '0.1s' }}>
        <FilterChip label="All" count={posts.length} active={active === null} onClick={() => setActive(null)} />
        {categories.length > 1
          ? categories.map((c) => (
              <FilterChip
                key={c.name}
                label={c.name}
                count={c.count}
                active={active === c.name}
                onClick={() => setActive(active === c.name ? null : c.name)}
              />
            ))
          : null}
      </div>

      <div className="pt-2">
        {visible.map((post, i) => {
          const external = Boolean(post.sourceUrl);
          const inner = (
            <>
              <h2 className="text-lg leading-tight font-semibold transition-colors group-hover:text-primary">{post.title}</h2>
              {post.description ? <p className="line-clamp-2 text-sm text-muted-foreground">{post.description}</p> : null}
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span className="flex flex-wrap gap-1.5">
                  {post.tags.slice(0, MAX_VISIBLE_TAGS).map((t) => (
                    <span key={t} className="rounded-md bg-muted px-2 py-0.5 text-xs">
                      {t}
                    </span>
                  ))}
                  {post.tags.length > MAX_VISIBLE_TAGS ? (
                    <span className="rounded-md bg-muted px-2 py-0.5 text-xs">+{post.tags.length - MAX_VISIBLE_TAGS} more</span>
                  ) : null}
                </span>
                <time dateTime={post.date}>{formatPostDate(post.date)}</time>
              </div>
              <span className="text-sm font-medium text-primary">Read more</span>
            </>
          );
          return (
            <article key={post.slug} className="group animate-in-up py-4" style={{ animationDelay: `${0.15 + i * 0.05}s` }}>
              {external ? (
                <a href={post.sourceUrl} target="_blank" rel="noopener noreferrer" className="block space-y-1.5">
                  {inner}
                </a>
              ) : (
                <Link href={`/blog/${post.slug}`} className="block space-y-1.5">
                  {inner}
                </Link>
              )}
            </article>
          );
        })}
        {visible.length === 0 ? <p className="py-8 text-sm text-muted-foreground">No posts yet.</p> : null}
      </div>
    </>
  );
}

function FilterChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm transition-colors ${
        active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
      }`}
    >
      {label}
      <span className={`text-xs ${active ? 'opacity-80' : 'opacity-60'}`}>{count}</span>
    </button>
  );
}
