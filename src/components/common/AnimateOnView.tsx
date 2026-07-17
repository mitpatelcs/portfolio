'use client';

import { useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';

/**
 * Reference scroll reveal: children start at opacity 0 / translateY(20px) and
 * play the fade-in-up animation once they enter the viewport (.in-view).
 */
export default function AnimateOnView({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('in-view');
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={cn('animate-in-up-on-view', className)}>
      {children}
    </div>
  );
}
