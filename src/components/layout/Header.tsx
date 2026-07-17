import Link from 'next/link';

import Container from '@/components/common/Container';
import SearchDialog from '@/components/layout/SearchDialog';
import ThemeToggle from '@/components/layout/ThemeToggle';
import { buildSearchIndex, config, navigation } from '@/lib/data';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container className="flex h-14 items-center justify-between">
        <nav className="flex items-center gap-6 text-sm font-medium">
          {navigation.links.map((link) => (
            <Link key={link.href} href={link.href} className="text-muted-foreground transition-colors hover:text-primary">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          {config.features.commandKSearch ? <SearchDialog index={buildSearchIndex()} /> : null}
          {config.features.themeToggle.enabled ? <ThemeToggle /> : null}
        </div>
      </Container>
    </header>
  );
}
