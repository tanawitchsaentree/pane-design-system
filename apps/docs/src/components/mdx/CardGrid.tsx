import Link from 'next/link';

export interface CardItem {
  title: string;
  description: string;
  href: string;
}

/**
 * Category/link card grid — the non-prose structure overview/guide pages need per the
 * docs-engine-upgrade order's G-D6 gate ("overview/guide page with zero non-prose structures").
 * Callers pass real data (component categories from `nav.ts`, package names from
 * `package.json`, etc.) — this component never invents its own item list.
 */
export function CardGrid({ items }: { items: CardItem[] }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 'var(--ds-space-inline-md)',
        marginBlock: 'var(--ds-space-stack-md)',
      }}
    >
      {items.map((item) => (
        <Link key={item.href} href={item.href} className="docs-card-grid-item">
          <div style={{ fontWeight: 'var(--ds-font-weight-semibold)', marginBlockEnd: 'var(--ds-space-stack-sm)' }}>
            {item.title}
          </div>
          <div style={{ fontSize: 'var(--ds-font-size-sm)', color: 'var(--ds-color-text-subtle)' }}>
            {item.description}
          </div>
        </Link>
      ))}
    </div>
  );
}
