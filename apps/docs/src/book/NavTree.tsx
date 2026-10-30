// The book's navigation as folding parts (MUI-style): each part opens and closes, the part and the family
// of the page you are on start open, and a search opens everything so every match shows. Components fold
// once more into their families, so 100-odd pages stay a short list. Pages new in this release say so.
import { useEffect, useState } from 'react';
import { CATEGORIES } from './components-data';
import { HISTORY } from './ComponentPage';

type Page = { path: string; title: string };
type Part = { title: string; pages: Page[] };
const latest = HISTORY[0]?.version;
const NEW_COMPONENTS = new Set(HISTORY.filter((h) => h.version === latest && /^new\b/i.test(h.text)).map((h) => h.component));
// chapters (not components) added in the current release
const NEW_PAGES = new Set(['/getting-started/language', '/getting-started/install-app', '/getting-started/ios', '/patterns/states']);
const isNew = (p: Page) => NEW_PAGES.has(p.path) || NEW_COMPONENTS.has(p.title);

function Fold({ id, title, open, onToggle, level, children }: { id: string; title: string; open: boolean; onToggle: () => void; level: 1 | 2; children: React.ReactNode }) {
  return (
    <div className={level === 1 ? 'nav-part' : 'nav-family'}>
      <button type="button" className={level === 1 ? 'nav-part-title nav-fold' : 'nav-family-title nav-fold'} aria-expanded={open} aria-controls={id} onClick={onToggle} data-nav-part={level === 1 ? '' : undefined}>
        <svg viewBox="0 0 16 16" aria-hidden="true" className="nav-chevron"><path d="M6 3.5 10.5 8 6 12.5" /></svg>{title}
      </button>
      {/* the body slides open and shut (grid rows 0fr→1fr); while shut it is inert, so its links are neither seen nor reached */}
      <div id={id} className="nav-body" data-open={open || undefined} inert={!open || undefined}><div className="nav-body-inner">{children}</div></div>
    </div>
  );
}

const Links = ({ pages, here, navigate }: { pages: Page[]; here?: string; navigate: (p: string) => void }) => (
  <ul className="toc flush">
    {pages.map((p) => (
      <li key={p.path}><a href={p.path} aria-current={p.path === here ? 'page' : undefined} onClick={(e) => { e.preventDefault(); navigate(p.path); }}>{p.title}{isNew(p) && <>{' '}<span className="nav-new">New</span></>}</a></li>
    ))}
  </ul>
);

export function NavTree({ parts, here, searching, navigate }: { parts: Part[]; here?: string; searching: boolean; navigate: (p: string) => void }) {
  const partOf = (path?: string) => parts.find((x) => x.pages.some((p) => p.path === path))?.title;
  const familyOf = (path?: string) => { const t = parts.flatMap((x) => x.pages).find((p) => p.path === path)?.title; return CATEGORIES.find((c) => t && c.names.includes(t))?.title; };
  const [open, setOpen] = useState<Set<string>>(() => new Set([partOf(here) ?? 'Getting started', familyOf(here) ?? ''].filter(Boolean)));
  // moving to a page opens its part and family, and leaves the others as the reader left them
  useEffect(() => { setOpen((o) => new Set([...o, partOf(here) ?? '', familyOf(here) ?? ''].filter(Boolean))); }, [here]); // eslint-disable-line react-hooks/exhaustive-deps
  const toggle = (k: string) => setOpen((o) => { const n = new Set(o); if (n.has(k)) n.delete(k); else n.add(k); return n; });
  const is = (k: string) => searching || open.has(k);
  return (
    <>
      {parts.filter((part) => part.pages.length).map((part, i) => (
        <Fold key={part.title} id={`nav-part-${i}`} title={part.title} level={1} open={is(part.title)} onToggle={() => toggle(part.title)}>
          {part.title !== 'Components' ? <Links pages={part.pages} here={here} navigate={navigate} /> : (
            <>
              {CATEGORIES.map((c, j) => {
                const pages = part.pages.filter((p) => c.names.includes(p.title));
                return pages.length ? (
                  <Fold key={c.title} id={`nav-family-${j}`} title={c.title} level={2} open={is(c.title)} onToggle={() => toggle(c.title)}>
                    <Links pages={pages} here={here} navigate={navigate} />
                  </Fold>
                ) : null;
              })}
              {(() => { const rest = part.pages.filter((p) => !CATEGORIES.some((c) => c.names.includes(p.title))); return rest.length ? <Links pages={rest} here={here} navigate={navigate} /> : null; })()}
            </>
          )}
        </Fold>
      ))}
    </>
  );
}
