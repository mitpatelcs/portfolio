import Link from 'next/link';

import Container from '@/components/common/Container';
import VisitorCount from '@/components/layout/VisitorCount';
import { SocialIcon } from '@/lib/icons';
import { config, copyrightName, footer, footerNavigate, socials } from '@/lib/data';

/** Reference footer: bg-muted/30, uppercase group labels, horizontal wrap nav,
 *  boxed social icon buttons, copyright line below. */
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-muted/30">
      <Container className="py-12">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
          <div className="flex flex-col gap-4">
            <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">Navigate</p>
            <nav className="flex flex-wrap gap-x-6 gap-y-1">
              {footerNavigate.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
              {footer.extraLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">Connect</p>
            <div className="flex flex-wrap gap-2">
              {socials.map((s) => (
                <a
                  key={`${s.platform}-${s.url}`}
                  href={s.url}
                  target={s.url.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  aria-label={s.label || s.platform}
                  title={s.label || s.platform}
                  className="flex size-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
                >
                  <SocialIcon platform={s.platform} label={s.label} className="size-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10 flex items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {year} {copyrightName}. All rights reserved.
          </p>
          {config.features.visitorCounter ? <VisitorCount /> : null}
        </div>
      </Container>
    </footer>
  );
}
