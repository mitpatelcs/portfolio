import { cn } from '@/lib/utils';

/** Green "● Working" pill from the reference experience rows. */
function WorkingBadge({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-400',
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-green-500" aria-hidden="true" />
      {label}
    </span>
  );
}

export { WorkingBadge };
