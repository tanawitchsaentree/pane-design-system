'use client';

import { useState } from 'react';
import { Button } from 'dial-react';

/**
 * Source panel for a full-page example template. `source` is passed in from a Server Component
 * that read it via `getTemplateSource()` (real file read, G-T2 same-source rule) — this component
 * only renders it plus copy/download affordances, never re-fetches or duplicates the string.
 */
export function TemplateSourceView({ source, filename }: { source: string; filename: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    void navigator.clipboard.writeText(source);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleDownload() {
    const blob = new Blob([source], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="docs-demo">
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--ds-space-inline-sm)', padding: 'var(--ds-space-inset-sm)' }}>
        <Button variant="link" intent="neutral" size="sm" onClick={handleDownload}>
          Download
        </Button>
        <Button variant="link" intent="neutral" size="sm" onClick={handleCopy}>
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
      <pre className="docs-demo-code" style={{ maxHeight: '480px', overflowY: 'auto' }}>
        {source}
      </pre>
    </div>
  );
}
