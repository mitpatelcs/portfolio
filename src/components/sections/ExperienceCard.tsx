import TechChip from '@/components/common/TechChip';
import ExperienceRow from '@/components/sections/ExperienceRow';
import type { ExperienceItem } from '@/lib/data';

/** Full /work card: compact row + tech chips + accomplishment bullets.
 *  Blocks with no data are omitted (verified-facts-only entries stay clean). */
export default function ExperienceCard({ item }: { item: ExperienceItem }) {
  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-4">
      <ExperienceRow item={item} />
      {item.technologies.length > 0 ? (
        <div>
          <h4 className="mb-2 text-sm font-semibold">Technologies &amp; Tools</h4>
          <div className="flex flex-wrap gap-2">
            {item.technologies.map((t) => (
              <TechChip key={t} name={t} />
            ))}
          </div>
        </div>
      ) : null}
      {item.highlights.length > 0 ? (
        <div>
          <h4 className="mb-2 text-sm font-semibold">What I&apos;ve done</h4>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            {item.highlights.map((h) => (
              <li key={h} className="flex gap-2">
                <span aria-hidden="true">•</span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
