import { WorkingBadge } from '@/components/ui/badge';
import type { ExperienceItem } from '@/lib/data';

function dates(item: ExperienceItem, short: boolean) {
  const end = item.isCurrent ? 'Present' : item.end;
  if (!short) return `${item.start} – ${end}`;
  const s = (v: string) => {
    const m = v.match(/^([A-Za-z]+)\s+(\d{4})$/);
    return m ? `${m[1].slice(0, 3)} ${m[2].slice(2)}` : v;
  };
  return `${s(item.start)} – ${item.isCurrent ? 'Present' : s(item.end)}`;
}

/** Compact reference experience row: company + badge + role left, dates + location right. */
export default function ExperienceRow({ item }: { item: ExperienceItem }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base font-bold">{item.company}</h3>
          {item.isCurrent ? <WorkingBadge label="Working" /> : null}
        </div>
        <p className="text-sm text-muted-foreground">{item.role}</p>
      </div>
      <div className="shrink-0 text-right text-sm text-muted-foreground">
        <p className="hidden sm:block">{dates(item, false)}</p>
        <p className="sm:hidden">{dates(item, true)}</p>
        {item.location ? (
          <>
            <p className="hidden sm:block">{item.location}</p>
            <p className="sm:hidden">{item.locationShort || item.location}</p>
          </>
        ) : null}
      </div>
    </div>
  );
}
