// Component API: one page per component that is only the contract a developer codes against. The import
// (root and subpath), every exported component and type with its props (generated from the TypeScript
// source, so it cannot drift), the component tokens a theme can override, and the keys it answers to.
import { CodeBlock, Page, Section, TOKENS } from './kit';
import { GeneratedProps } from './ComponentPage';
import meta from './meta.json';
import type { ComponentChapter } from './components-data';
import { navigate } from './router';

const kebab = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

export function ApiPage({ c }: { c: ComponentChapter }) {
  const m = (meta.components as Record<string, (typeof meta.components)[keyof typeof meta.components]>)[c.name];
  const group = kebab(c.name);
  const own = Object.entries(TOKENS).filter(([k, t]) => t.tier === 'component' && k.startsWith(`${group}.`));
  const names = m?.exports.map((e) => e.displayName) ?? [c.name];
  return (
    <Page eyebrow="Component API" title={c.name} lede={<p>This is what you code against when you use {c.name}. It covers the import, every prop, the tokens a theme can change and the keys it answers to. How and when to use it is on <a href={`/components/${c.slug}/usage`} onClick={(e) => { e.preventDefault(); navigate(`/components/${c.slug}/usage`); }}>the {c.name} page</a>.</p>}>
      <Section id="import" title="Import">
        <p>From the package root, which keeps only what you use, or from the component's own entry.</p>
        <CodeBlock label="TSX" code={`import { ${names.join(', ')} } from 'pane-react';\n// or\nimport { ${names.join(', ')} } from 'pane-react/${c.name}';`} />
      </Section>
      <Section id="props" title="Props">
        {m ? <GeneratedProps m={m} inherits={c.inherits} /> : <p>No generated props for this component.</p>}
      </Section>
      <Section id="tokens" title="Theme tokens">
        {own.length ? (
          <>
            <p>Set any of these on a parent element to change {c.name} below it without touching its code. Each points at a semantic token by default, so a theme change still flows through.</p>
            <div className="table-wrap"><table>
              <caption>{own.length} component tokens for {c.name}</caption>
              <thead><tr><th scope="col">Custom property</th><th scope="col">Points at</th><th scope="col">Type</th></tr></thead>
              <tbody>{own.map(([k, t]) => <tr key={k}><th scope="row"><code>{t.css}</code></th><td><code>{t.ref ? `--ds-${t.ref.replace(/\./g, '-')}` : String(t.value)}</code></td><td>{t.type}</td></tr>)}</tbody>
            </table></div>
          </>
        ) : <p>{c.name} has no tokens of its own; it takes its look from the components and semantic tokens it is built from.</p>}
      </Section>
      {c.keyboard && (
        <Section id="keyboard" title="Keyboard">
          <div className="table-wrap"><table>
            <caption>Keys {c.name} answers to</caption>
            <thead><tr><th scope="col">Key</th><th scope="col">What happens</th></tr></thead>
            <tbody>{c.keyboard.map(([k, does], i) => <tr key={i}><th scope="row"><kbd>{k}</kbd></th><td>{does}</td></tr>)}</tbody>
          </table></div>
        </Section>
      )}
    </Page>
  );
}
