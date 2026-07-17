import * as React from 'react';

import { cn } from '@/lib/utils';

/** Reference card: rounded-xl, hairline ring, bg-card. */
function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card"
      className={cn(
        'flex h-full w-full flex-col gap-4 overflow-hidden rounded-xl border border-border bg-card py-4 text-sm text-card-foreground ring-1 ring-foreground/10',
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-content" className={cn('flex flex-col gap-1 px-4', className)} {...props} />;
}

export { Card, CardContent };
