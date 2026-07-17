'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

import CopyButton from '@/components/common/CopyButton';

/** Reference "Show"/"Hide" collapsible code panel with a copy button. */
export default function CollapsibleCode({ title, code }: { title: string; code: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-sm font-semibold"
        aria-expanded={open}
      >
        {title}
        <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
          {open ? 'Hide' : 'Show'}
          <ChevronDown className={`size-4 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
        </span>
      </button>
      {open ? (
        <div className="border-t border-border">
          <div className="flex justify-end px-4 pt-3">
            <CopyButton text={code} />
          </div>
          <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed">{code}</pre>
        </div>
      ) : null}
    </div>
  );
}
