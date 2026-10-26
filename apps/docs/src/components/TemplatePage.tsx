import { getTemplateSource } from '@/lib/templateSource';
import { TemplateSourceView } from './TemplateSourceView';

/**
 * Shared wrapper for every `/examples/*` template — renders the template itself full-bleed, then
 * a "View source" section underneath (template-contract.md point 3: complete source view, same-
 * source rule). One wrapper instead of repeating the source-panel markup in all 6 template pages.
 */
export function TemplatePage({
  children,
  sourceRelativePath,
  filename,
}: {
  children: React.ReactNode;
  sourceRelativePath: string;
  filename: string;
}) {
  const source = getTemplateSource(sourceRelativePath);

  return (
    <div>
      {children}
      <div style={{ borderBlockStart: 'var(--ds-border-width-hairline) solid var(--ds-color-border-hairline)', padding: 'var(--ds-space-inset-lg)', backgroundColor: 'var(--ds-color-surface-canvas)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'var(--ds-font-size-lg)', fontWeight: 'var(--ds-font-weight-semibold)', marginBlockEnd: 'var(--ds-space-stack-md)' }}>
            Source
          </h2>
          <TemplateSourceView source={source} filename={filename} />
        </div>
      </div>
    </div>
  );
}
