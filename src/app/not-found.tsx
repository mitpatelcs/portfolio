import Link from 'next/link';

import Container from '@/components/common/Container';
import { buttonVariants } from '@/components/ui/button';
import { config } from '@/lib/data';

export default function NotFound() {
  return (
    <Container>
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <p className="animate-in-up text-7xl font-bold tracking-tight">404</p>
        <div className="animate-in-up space-y-1" style={{ animationDelay: '0.05s' }}>
          <h1 className="text-xl font-semibold">Page not found</h1>
          <p className="text-sm text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
        <div className="animate-in-up flex gap-2" style={{ animationDelay: '0.1s' }}>
          <Link href="/" className={buttonVariants({ variant: 'default' })}>
            Home
          </Link>
          {config.sections.blog ? (
            <Link href="/blog" className={buttonVariants({ variant: 'outline' })}>
              Blog
            </Link>
          ) : null}
        </div>
      </div>
    </Container>
  );
}
