// The header's MUI-style tools: the version with what it means, a one-line announcement of the release,
// search over every chapter with ⌘K (Pane's own CommandPalette), and the source on GitHub.
import { useState } from 'react';
import { Badge, CommandPalette, Kbd, Menu, Popover, SegmentedControl, Select } from 'pane-react';
import { version, componentCount } from 'virtual:book-facts';
import { PARTS, navigate } from './router';

const REPO = 'https://github.com/tanawitchsaentree/pane-design-system';
const Chevron = () => <svg viewBox="0 0 16 16" aria-hidden="true" className="tb-chevron"><path d="M4 6l4 4 4-4" /></svg>;

export function VersionMenu() {
  return (
    <Menu label="Versions" align="start"
      trigger={<button type="button" className="tb-version" aria-label={`v${version}, versions`}>v{version}<Chevron /></button>}
      items={[
        { label: `${version} · latest`, onSelect: () => navigate('/reference/changelog') },
        'separator',
        { label: 'What changed', onSelect: () => navigate('/reference/changelog') },
        { label: 'Upgrade guide', onSelect: () => navigate('/getting-started/migrating') },
        { label: 'Source on GitHub', onSelect: () => window.open(`${REPO}/releases`, '_blank', 'noopener') },
      ]} />
  );
}

export function Announcement() {
  return (
    <a className="tb-news" href="/reference/changelog" onClick={(e) => { e.preventDefault(); navigate('/reference/changelog'); }}>
      <Badge tone="accent" className="tb-news-tag">New</Badge>Pane {version.split('.').slice(0, 2).join('.')}: {componentCount} components in English and Thai
    </a>
  );
}

export function SearchButton() {
  const [open, setOpen] = useState(false);
  // the same title in two parts (Chip the component and Chip in Component API) is told apart by its part,
  // or the results show two rows that read the same
  const count = new Map<string, number>(); for (const part of PARTS) for (const p of part.pages) count.set(p.title, (count.get(p.title) ?? 0) + 1);
  const commands = PARTS.flatMap((part) => part.pages.map((p) => ({ id: p.path, label: (count.get(p.title) ?? 0) > 1 ? `${p.title} · ${part.title}` : p.title, group: part.title, keywords: [part.title], onSelect: () => navigate(p.path) })));
  return (
    <>
      <button type="button" className="tb-search" onClick={() => setOpen(true)} aria-keyshortcuts="Meta+K Control+K">
        <svg viewBox="0 0 24 24" aria-hidden="true" className="tb-icon"><circle cx="10.5" cy="10.5" r="6" /><path d="M15 15l5.5 5.5" /></svg>
        <span className="tb-search-label">Search</span><Kbd>⌘K</Kbd>
      </button>
      <CommandPalette commands={commands} open={open} onOpenChange={setOpen} placeholder="Search chapters and components" />
    </>
  );
}

export function GitHubLink() {
  return (
    <a className="tb-iconlink" href={REPO} target="_blank" rel="noreferrer" aria-label="Pane on GitHub (opens in a new tab)">
      <svg viewBox="0 0 16 16" aria-hidden="true" className="tb-icon tb-fill"><path d="M8 .2a8 8 0 0 0-2.5 15.6c.4 0 .5-.2.5-.4v-1.4c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.2 1.9.9 2.3.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.2-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8a7.6 7.6 0 0 1 4 0c1.5-1 2.2-.8 2.2-.8.4 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.2 0 3.1-1.9 3.8-3.6 4 .3.3.6.8.6 1.5v2.2c0 .2.1.5.6.4A8 8 0 0 0 8 .2Z" /></svg>
    </a>
  );
}

/** The look of the book in one place (M1): material first, then brand, then the demo backdrop. The theme
 *  stays a visible control beside it because it is the one people change most. The button says the
 *  current choice, so the reader can see what the book is showing without opening it. */
export function AppearanceMenu({ material, onMaterial, brand, onBrand, brands, scene, onScene, scenes }: {
  material: 'glass' | 'solid'; onMaterial: (m: 'glass' | 'solid') => void;
  brand: string; onBrand: (b: string) => void; brands: Array<{ id: string; name: string }>;
  scene: string; onScene: (s: string) => void; scenes: Array<{ id: string; label: string }>;
}) {
  const brandName = brand === 'pane' ? 'Pane' : brands.find((b) => b.id === brand)?.name ?? brand;
  const sceneName = scenes.find((x) => x.id === scene)?.label.replace(/ \(.*\)$/, '') ?? scene;
  const summary = `${material === 'glass' ? 'Glass' : 'Solid'} · ${brandName} · ${sceneName}`;
  return (
    <span className="tb-appearance" data-scene-control="" data-brand-control="" data-material-control="">
      <Popover title="Appearance" align="end"
        trigger={<button type="button" className="tb-version tb-look" aria-label={`Appearance of the examples: ${summary}`} title={summary}><svg className="tb-look-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" /><path d="M12 3.5a8.5 8.5 0 0 0 0 17z" /></svg><span className="tb-look-text">Appearance</span><Chevron /></button>}>
        <div className="tb-look-body">
          <p className="tb-look-intro">How the examples in this book look. In your own product these are one prop each, set in code.</p>
          <SegmentedControl label="Material" value={material} onValueChange={(v) => onMaterial(v as 'glass' | 'solid')} options={[{ value: 'glass', label: 'Glass' }, { value: 'solid', label: 'Solid' }]} />
          <Select label="Brand" size="sm" value={brand} onValueChange={onBrand} options={[{ value: 'pane', label: 'Pane' }, ...brands.map((b) => ({ value: b.id, label: b.name }))]} />
          <Select label="Demo backdrop" size="sm" value={scene} onValueChange={onScene} options={scenes.map((x) => ({ value: x.id, label: x.label }))} />
          <a className="tb-look-link" href="/getting-started/look" onClick={(e) => { e.preventDefault(); navigate('/getting-started/look'); }}>How to choose these for a product</a>
        </div>
      </Popover>
    </span>
  );
}
