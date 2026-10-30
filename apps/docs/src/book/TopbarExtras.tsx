// The header's MUI-style tools: the version with what it means, a one-line announcement of the release,
// search over every chapter with ⌘K (Pane's own CommandPalette), and the source on GitHub.
import { useState } from 'react';
import { CommandPalette, Kbd, Menu } from 'pane-react';
import meta from './meta.json';
import { PARTS, navigate } from './router';

const REPO = 'https://github.com/tanawitchsaentree/pane-design-system';
const Chevron = () => <svg viewBox="0 0 16 16" aria-hidden="true" className="tb-chevron"><path d="M4 6l4 4 4-4" /></svg>;

export function VersionMenu() {
  return (
    <Menu label="Versions" align="start"
      trigger={<button type="button" className="tb-version" aria-label={`v${meta.version}, versions`}>v{meta.version}<Chevron /></button>}
      items={[
        { label: `${meta.version} · latest`, onSelect: () => navigate('/reference/changelog') },
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
      <span className="tb-news-tag">New</span>Pane {meta.version.split('.').slice(0, 2).join('.')}: {Object.keys(meta.components).length} components in English and Thai
    </a>
  );
}

export function SearchButton() {
  const [open, setOpen] = useState(false);
  const commands = PARTS.flatMap((part) => part.pages.map((p) => ({ id: p.path, label: p.title, group: part.title, keywords: [part.title], onSelect: () => navigate(p.path) })));
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
