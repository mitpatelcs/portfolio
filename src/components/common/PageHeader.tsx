import { Separator } from '@/components/ui/separator';

/** The H1 + subtitle + separator pattern every reference subpage opens with. */
export default function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <>
      <div className="animate-in-up pb-8">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle ? <p className="max-w-2xl text-muted-foreground">{subtitle}</p> : null}
      </div>
      <div className="animate-in-up" style={{ animationDelay: '0.05s' }}>
        <Separator className="mb-6" />
      </div>
    </>
  );
}
