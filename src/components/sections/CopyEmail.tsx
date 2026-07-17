'use client';

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

/** Reference copy-email affordance: address on ≥md, "Email" on mobile,
 *  copy icon swaps to a check for 2s after copying. */
export default function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — leave the address visible
    }
  }

  return (
    <span
      role="button"
      tabIndex={0}
      aria-label="Copy email"
      onClick={copy}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && copy()}
      className="group inline-flex cursor-pointer items-center gap-1.5 text-muted-foreground transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <span className="hidden group-hover:text-primary md:block">{email}</span>
      <span className="block group-hover:text-primary md:hidden">Email</span>
      <span className="relative inline-flex size-4 shrink-0 items-center justify-center group-hover:text-primary">
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      </span>
    </span>
  );
}
