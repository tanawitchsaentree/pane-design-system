'use client';

import { useState } from 'react';
import { Button } from 'dial-react';

/**
 * Renders real, live children (an actual import from dial-react, composed by the MDX author —
 * never an iframe, never a screenshot) with a copy-able code panel below showing the exact
 * source string passed as `code`. Per the order: the render and the code shown must come from
 * the same source, so callers pass the literal JSX source as a string alongside the real
 * rendered element — see any component MDX page for the pattern.
 *
 * The toggle/copy controls below are themselves `dial-react`'s own `Button` — this docs site is
 * built with the system it documents, so its own chrome dogfoods the library rather than reaching
 * for a raw `<button>`.
 */
export function Demo({ code, children }: { code: string; children: React.ReactNode }) {
  const [showCode, setShowCode] = useState(true);
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    void navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="docs-demo">
      <div className="docs-demo-preview">{children}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--ds-space-inset-sm)' }}>
        <Button variant="link" intent="neutral" size="sm" onClick={() => setShowCode((v) => !v)}>
          {showCode ? 'Hide code' : 'Show code'}
        </Button>
        {showCode && (
          <Button variant="link" intent="neutral" size="sm" onClick={handleCopy}>
            {copied ? 'Copied' : 'Copy'}
          </Button>
        )}
      </div>
      {showCode && <pre className="docs-demo-code">{code}</pre>}
    </div>
  );
}
