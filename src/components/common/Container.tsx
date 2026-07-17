import { cn } from '@/lib/utils';

/** Reference layout: narrow single column, ~672px. */
export default function Container({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('container mx-auto max-w-2xl px-4', className)} {...props} />;
}
