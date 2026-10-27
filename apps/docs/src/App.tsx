import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Button, Card, Environment } from 'pane-react';
import { PAGES, PARTS, navigate, useRoute } from './book/router';
import { Link, SceneContext, VerifyContext, type Conformance, type Evidence } from './book/kit';
import { PAGE_COMPONENTS } from './book/pages';
import { SCENES, sceneById } from './scenes';

// Verification results ship inside the bundle (the verify run rebuilds the docs after writing them),
// so badges and evidence tables render in the same frame as the page instead of popping in later.
const VERIFY = import.meta.glob('../public/{evidence,conformance}.json', { eager: true, import: 'default' }) as Record<string, unknown>;
const verifyFile = <T,>(name: string) => (VERIFY[`../public/${name}.json`] as T | undefined) ?? null;
// A stale or older-format file must read as "unverified", never crash the page or show wrong numbers.
const validEvidence = (e: Evidence | null) => (e && Array.isArray(e.modes) && e.harness && e.docsPage && Array.isArray(e.summary?.informational) ? e : null);
const validConformance = (c: Conformance | null) => (c && Array.isArray(c.checks) ? c : null);

/** Backdrop photo; on change the new scene fades in over the old one (motion.scene). */
function SceneBackdrop({ scene }: { scene: string }) {
  const [layers, setLayers] = useState([scene]);
  useEffect(() => { setLayers((l) => (l[l.length - 1] === scene ? l : [l[l.length - 1], scene])); }, [scene]);
  return (
    <div className="env" aria-hidden="true">
      {layers.map((s, i) => <SceneLayer key={`${s}-${i}`} scene={s} fade={i === layers.length - 1 && layers.length > 1} />)}
    </div>
  );
}

// The photo fades in once it has decoded, over the scene's average colour painted by index.html on the
// first frame, so the backdrop never pops in half-loaded.
function SceneLayer({ scene, fade }: { scene: string; fade: boolean }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const img = new Image();
    img.src = `/scenes/${scene}.webp`;
    let live = true;
    img.decode().catch(() => {}).then(() => live && setReady(true));
    return () => { live = false; };
  }, [scene]);
  return <div className={`env-layer${fade ? ' env-in' : ''}${ready ? ' ready' : ''}`} style={{ backgroundImage: ready ? `url(/scenes/${scene}.webp)` : undefined }} />;
}

function useOnThisPage(path: string) {
  const [items, setItems] = useState<Array<{ id: string; title: string }>>([]);
  // layout effect: the list is filled before the browser paints, so it never appears a frame late
  useLayoutEffect(() => {
    setItems([...document.querySelectorAll('main .book-section')].map((s) => ({ id: s.id, title: s.querySelector('h2')?.textContent?.replace(/^#/, '') ?? s.id })));
  }, [path]);
  return items;
}

export function App() {
  const path = useRoute();
  const evidence = validEvidence(verifyFile<Evidence>('evidence'));
  const conformance = validConformance(verifyFile<Conformance>('conformance'));
  const [scene, setScene] = useState(sceneById(new URLSearchParams(location.search).get('scene') ?? 'room').id);
  const [q, setQ] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  // Theme: system follows prefers-color-scheme; the choice is stored; ?theme= overrides (tests).
  const [themePref, setThemePref] = useState<'system' | 'light' | 'dark'>(() => (new URLSearchParams(location.search).get('theme') as 'light' | 'dark' | null) ?? ((localStorage.getItem('pane-theme') as 'system' | 'light' | 'dark' | null) ?? 'system'));
  const [systemLight, setSystemLight] = useState(() => matchMedia('(prefers-color-scheme: light)').matches);
  useEffect(() => {
    const mq = matchMedia('(prefers-color-scheme: light)');
    const on = () => setSystemLight(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  const theme = themePref === 'system' ? (systemLight ? 'light' : 'dark') : themePref;
  useLayoutEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem('pane-theme', themePref); }, [theme, themePref]);
  const menuButton = useRef<HTMLButtonElement>(null);
  const firstRender = useRef(true);

  // A chapter is a new page: close the menu, start at the top, move focus to the page heading.
  useEffect(() => {
    setMenuOpen(false);
    if (firstRender.current) { firstRender.current = false; return; }
    if (location.hash) return;
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    requestAnimationFrame(() => document.getElementById('page-title')?.focus({ preventScroll: true }));
  }, [path]);
  // Menu drawer (narrow screens): Esc closes, focus goes in on open and back to the button on close.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('keydown', onKey);
    requestAnimationFrame(() => document.querySelector<HTMLElement>('#book-nav input, #book-nav a')?.focus());
    return () => { document.removeEventListener('keydown', onKey); menuButton.current?.focus(); };
  }, [menuOpen]);
  const onPage = useOnThisPage(path);

  useEffect(() => {
    const u = new URL(location.href);
    u.searchParams.set('scene', scene);
    history.replaceState(null, '', u);
  }, [scene]);
  useEffect(() => {
    const t = PAGES.find((p) => p.path === path)?.title;
    document.title = t ? `${t}. Pane` : 'Pane';
  }, [path]);

  const PageComponent = PAGE_COMPONENTS[path];
  const idx = PAGES.findIndex((p) => p.path === path);
  const [prev, next] = [PAGES[idx - 1], PAGES[idx + 1]];
  const filtered = useMemo(() => PARTS.map((part) => ({ ...part, pages: part.pages.filter((p) => !q || p.title.toLowerCase().includes(q.toLowerCase()) || part.title.toLowerCase().includes(q.toLowerCase())) })).filter((p) => p.pages.length), [q]);

  return (
    <VerifyContext.Provider value={{ evidence, conformance }}>
    <SceneContext.Provider value={scene}>
      <Environment brightness={sceneById(scene).brightness} className="page">
        <SceneBackdrop scene={scene} />
        <a className="skip" href="#main">Skip to content</a>

        <header className="topbar">
          <Link to="/"><span className="brand">Pane</span></Link>
          <span className="topbar-title muted">{PAGES[PAGES.findIndex((p) => p.path === path)]?.title}</span>
          <Button ref={menuButton} data-menu-toggle="" size="sm" variant="glass" aria-expanded={menuOpen} aria-controls="book-nav" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? 'Close' : 'Menu'}</Button>
        </header>
        {menuOpen && <div className="drawer-scrim" aria-hidden="true" onClick={() => setMenuOpen(false)} />}

        <aside className={`rail${menuOpen ? ' open' : ''}`} id="book-nav" aria-label="Book navigation">
          <Card as="div" className="brand-card">
            <Link to="/"><span className="brand">Pane</span></Link>
            <p className="flush muted small">Spatial glass design system · pilot</p>
          </Card>
          <Card as="div">
            <p className="flush eyebrow" id="theme-label">Theme</p>
            <div className="scene-picker" role="group" aria-labelledby="theme-label" data-theme-control="">
              {(['system', 'light', 'dark'] as const).map((t) => (
                <Button key={t} size="sm" variant={t === themePref ? 'accent' : 'glass'} aria-pressed={t === themePref} data-theme-value={t} onClick={() => setThemePref(t)}>{t[0].toUpperCase() + t.slice(1)}</Button>
              ))}
            </div>
            <p className="flush eyebrow" id="scene-label">Scene behind the glass</p>
            <div className="scene-picker" role="group" aria-labelledby="scene-label">
              {SCENES.map((s) => <Button key={s.id} size="sm" variant={s.id === scene ? 'accent' : 'glass'} aria-pressed={s.id === scene} onClick={() => setScene(s.id)}>{s.label}</Button>)}
            </div>
          </Card>
          <nav aria-label="Book" data-book-nav="">
            <Card as="div" className="nav-card">
              <label className="field"><span className="eyebrow">Find a chapter</span><input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Button, motion, tokens…" /></label>
              <div className="nav-scroll">
              {filtered.map((part) => (
                <div key={part.title} className="nav-part">
                  <p className="nav-part-title" data-nav-part="">{part.title}</p>
                  <ul className="toc flush">
                    {part.pages.map((p) => <li key={p.path}><a href={p.path} aria-current={p.path === path ? 'page' : undefined} onClick={(e) => { e.preventDefault(); navigate(p.path); }}>{p.title}</a></li>)}
                  </ul>
                </div>
              ))}
              </div>
            </Card>
          </nav>
        </aside>

        <main id="main" className="content" key={path} inert={menuOpen || undefined}>
          {PageComponent ? <PageComponent /> : (
            <Card as="section" aria-labelledby="nf"><h1 id="nf" className="flush page-title">Not in the book</h1><p className="flush muted">No chapter at {path}. <Link to="/">Back to the overview</Link>.</p></Card>
          )}
          <nav className="pager" aria-label="Chapters">
            {prev ? <Card as="div" className="pager-card" data-surface=""><p className="flush eyebrow">Previous</p><Link to={prev.path}>{prev.title}</Link></Card> : <span />}
            {next ? <Card as="div" className="pager-card next" data-surface=""><p className="flush eyebrow">Next</p><Link to={next.path}>{next.title}</Link></Card> : <span />}
          </nav>
        </main>

        {onPage.length > 2 && (
          <aside className="on-page" aria-label="On this page">
            <Card as="div">
              <p className="flush eyebrow">On this page</p>
              <ul className="toc flush">{onPage.map((s) => <li key={s.id}><a href={`#${s.id}`}>{s.title}</a></li>)}</ul>
            </Card>
          </aside>
        )}
      </Environment>
    </SceneContext.Provider>
    </VerifyContext.Provider>
  );
}
