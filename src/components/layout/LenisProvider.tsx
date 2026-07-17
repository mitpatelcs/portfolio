'use client';

import Lenis from 'lenis';
import { useEffect } from 'react';

/** Reference smooth scrolling (Lenis), skipped for reduced-motion users. */
export default function LenisProvider() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ autoRaf: true });
    return () => lenis.destroy();
  }, []);
  return null;
}
