import { RegistryIcon } from '@/lib/icons';
import { getTechnology } from '@/lib/data';

/**
 * Reference tech chip: icon-only pill whose text label expands on hover/focus
 * (max-w 0 -> 8rem with a 150ms delay), plus a subtle scale.
 */
export default function TechChip({ name }: { name: string }) {
  const tech = getTechnology(name);
  return (
    <div className="group inline-flex items-center gap-0 rounded-md border border-dashed border-border bg-muted/50 px-2 py-1 text-sm font-medium text-foreground transition-all duration-300 ease-out outline-none hover:scale-[1.03] hover:gap-1.5 hover:bg-muted hover:shadow-sm hover:delay-150 focus-visible:gap-1.5 focus-visible:ring-2 focus-visible:ring-ring">
    <span className="size-4 shrink-0 [&_svg]:size-4">
        <RegistryIcon iconKey={tech?.icon ?? ''} className="size-4" />
      </span>
      <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 ease-out group-hover:max-w-32 group-hover:opacity-100 group-hover:delay-150 group-focus-visible:max-w-32 group-focus-visible:opacity-100 group-focus-visible:delay-150">
        {name}
      </span>
    </div>
  );
}
