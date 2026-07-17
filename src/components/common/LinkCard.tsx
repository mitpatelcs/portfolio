import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

/**
 * Reference home "Development"/"Personal" card: title + one-liner in a rounded
 * card, arrow icon fades in on hover. Internal or external.
 */
export default function LinkCard({
  href,
  title,
  description,
  external = false,
}: {
  href: string;
  title: string;
  description: string;
  external?: boolean;
}) {
  const className =
    'group flex flex-row items-center justify-between gap-3 rounded-xl border border-border bg-card px-3 py-2.5 no-underline transition-colors hover:bg-muted/60';
  const body = (
    <>
      <div className="min-w-0 flex-1 space-y-0.5">
        <h3 className="text-base leading-tight font-semibold text-primary">{title}</h3>
        <p className="line-clamp-2 text-xs text-muted-foreground sm:text-sm">{description}</p>
      </div>
      <span className="inline-flex shrink-0 opacity-0 transition-opacity group-hover:opacity-100">
        <ArrowUpRight className="size-4 text-muted-foreground" aria-hidden="true" />
      </span>
    </>
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {body}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {body}
    </Link>
  );
}
