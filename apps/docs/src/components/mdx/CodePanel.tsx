'use client';

import { useRef, useState, isValidElement } from 'react';
import type { HTMLAttributes } from 'react';
import { Button } from 'dial-react';

/**
 * docs-engine craft-contract CODE PANEL ANATOMY — the single shared component every multi-line/
 * statement-bearing code sample renders through. Registered globally as MDX's own `pre` override
 * (`mdx-components.tsx`), so every existing ` ```lang ` fence across all 56 content pages gets
 * this treatment automatically — no per-page edits.
 *
 * Root cause this fixes (docs-engine-amendment-craft-contract order): `globals.css` only ever
 * styled `.docs-demo-code` (the class `<Demo>`/`<Playground>` apply themselves) — a plain
 * MDX-authored fence outside those two components had ZERO pre/code styling, so it fell back to
 * the browser default (transparent background, no padding) while each token's `<code>`-wrapped
 * inline styling from Shiki still visually reads as separate pills with no fence chrome around
 * them. This component supplies that missing chrome once, for every fence, everywhere.
 *
 * Syntax coloring itself comes from `rehypeCode` (next.config.mjs, real Shiki, dual-theme via
 * `--shiki-light`/`--shiki-dark` CSS variables on each token span) — this component only adds the
 * panel-level chrome (surface, padding, border, language tag, copy button, horizontal scroll) on
 * top of Shiki's own output, using real `--ds-*` tokens throughout, never a hardcoded value.
 */
export function CodePanel({ children }: HTMLAttributes<HTMLPreElement>) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  // children is the <code class="language-xxx">...</code> element Shiki/rehypeCode produced —
  // read its language class here (client-side) rather than threading a second prop, since the
  // real class is already the one source of truth for what language this block is.
  const codeClassName = isValidElement(children) ? ((children.props as { className?: string }).className ?? '') : '';
  const languageMatch = /language-(\w+)/.exec(codeClassName);
  const language = languageMatch ? languageMatch[1] : null;

  function handleCopy() {
    const text = preRef.current?.textContent ?? '';
    void navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="docs-code-panel">
      <div className="docs-code-panel-header">
        <span className="docs-code-panel-lang">{language ?? 'text'}</span>
        <Button variant="link" intent="neutral" size="sm" onClick={handleCopy}>
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
      <pre ref={preRef} tabIndex={0}>
        {children}
      </pre>
    </div>
  );
}
