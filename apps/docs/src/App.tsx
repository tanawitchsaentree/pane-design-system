import { useEffect, useMemo, useState } from 'react';
import { Button, Card, Environment } from 'pane-react';
import { PAGES, PARTS, navigate, useRoute } from './book/router';
import { Link, VerifyContext, type Conformance, type Evidence } from './book/kit';
import { PAGE_COMPONENTS } from './book/pages';
import { SCENES, sceneById } from './scenes';

function useJson<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  useEffect(() => { fetch(url).then((r) => (r.ok ? r.json() : null)).then(setData).catch(() => setData(null)); }, [url]);
  return data;
}
// A stale or older-format file must read as "unverified", never crash the page or show wrong numbers.
const validEvidence = (e: Evidence | null) => (e && Array.isArray(e.modes) && e.harness && e.docsPage && Array.isArray(e.summary?.informational) ? e : null);
const validConformance = (c: Conformance | null) => (c && Array.isArray(c.checks) ? c : null);

/** Backdrop photo; on change the new scene fades in over the old one (motion.scene). */
function SceneBackdrop({ scene }: { scene: string }) {
  const [layers, setLayers] = useState([scene]);
  useEffect(() => { setLayers((l) => (l[l.length - 1] === scene ? l : [l[l.length - 1], scene])); }, [scene]);
  return (
    <div className="env" aria-hidden="true">
      {layers.map((s, i) => <div key={`${s}-${i}`} className={`env-layer${i === layers.length - 1 && layers.length > 1 ? ' env-in' : ''}`} style={{ backgroundImage: `url(/scenes/${s}.jpg)` }} />)}
    </div>
  );
}

/** Sections rise into place as they scroll into view (disabled under reduced motion, in CSS). */
function useReveal(path: string) {
  useEffect(() => {
    const els = [...document.querySelectorAll('.reveal')];
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach((el, i) => { (el as HTMLElement).style.setProperty('--i', String(i % 6)); io.observe(el); });
    return () => io.disconnect();
  }, [path]);
}

function useOnThisPage(path: string) {
  const [items, setItems] = useState<Array<{ id: string; title: string }>>([]);
  useEffect(() => {
    const t = setTimeout(() => setItems([...document.querySelectorAll('main .book-section')].map((s) => ({ id: s.id, title: s.querySelector('h2')?.textContent?.replace(/^#/, '') ?? s.id }))), 0);
    return () => clearTimeout(t);
  }, [path]);
  return items;
}

export function App() {
  const path = useRoute();
  const evidence = validEvidence(useJson<Evidence>('/evidence.json'));
  const conformance = validConformance(useJson<Conformance>('/conformance.json'));
  const [scene, setScene] = useState(sceneById(new URLSearchParams(location.search).get('scene') ?? 'room').id);
  const [q, setQ] = useState('');
  useReveal(path);
  const onPage = useOnThisPage(path);

  useEffect(() => {
    const u = new URL(location.href);
    u.searchParams.set('scene', scene);
    history.replaceState(null, '', u);
  }, [scene]);
  useEffect(() => {
    const t = PAGES.find((p) => p.path === path)?.title;
    document.title = t ? `${t} — Pane` : 'Pane';
  }, [path]);

  const PageComponent = PAGE_COMPONENTS[path];
  const idx = PAGES.findIndex((p) => p.path === path);
  const [prev, next] = [PAGES[idx - 1], PAGES[idx + 1]];
  const filtered = useMemo(() => PARTS.map((part) => ({ ...part, pages: part.pages.filter((p) => !q || p.title.toLowerCase().includes(q.toLowerCase()) || part.title.toLowerCase().includes(q.toLowerCase())) })).filter((p) => p.pages.length), [q]);

  return (
    <VerifyContext.Provider value={{ evidence, conformance }}>
      <Environment brightness={sceneById(scene).brightness} className="page">
        <SceneBackdrop scene={scene} />
        <a className="skip" href="#main">Skip to content</a>

        <aside className="rail">
          <Card as="div" className="brand-card">
            <Link to="/"><span className="brand">Pane</span></Link>
            <p className="flush muted small">Spatial glass design system · pilot</p>
          </Card>
          <Card as="div">
            <p className="flush eyebrow" id="scene-label">Scene behind the glass</p>
            <div className="scene-picker" role="group" aria-labelledby="scene-label">
              {SCENES.map((s) => <Button key={s.id} size="sm" variant={s.id === scene ? 'accent' : 'glass'} aria-pressed={s.id === scene} onClick={() => setScene(s.id)}>{s.label}</Button>)}
            </div>
          </Card>
          <nav aria-label="Book">
            <Card as="div" className="nav-card">
              <label className="field"><span className="eyebrow">Find a chapter</span><input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Button, motion, tokens…" /></label>
              <div className="nav-scroll">
              {filtered.map((part) => (
                <div key={part.title} className="nav-part">
                  <p className="flush eyebrow">{part.title}</p>
                  <ul className="toc flush">
                    {part.pages.map((p) => <li key={p.path}><a href={p.path} aria-current={p.path === path ? 'page' : undefined} onClick={(e) => { e.preventDefault(); navigate(p.path); }}>{p.title}</a></li>)}
                  </ul>
                </div>
              ))}
              </div>
            </Card>
          </nav>
        </aside>

        <main id="main" className="content" key={path}>
          {PageComponent ? <PageComponent /> : (
            <Card as="section" aria-labelledby="nf"><h1 id="nf" className="flush page-title">Not in the book</h1><p className="flush muted">No chapter at {path}. <Link to="/">Back to the overview</Link>.</p></Card>
          )}
          <nav className="pager" aria-label="Chapters">
            {prev ? <Card as="div" className="pager-card"><p className="flush eyebrow">Previous</p><Link to={prev.path}>{prev.title}</Link></Card> : <span />}
            {next ? <Card as="div" className="pager-card next"><p className="flush eyebrow">Next</p><Link to={next.path}>{next.title}</Link></Card> : <span />}
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
    </VerifyContext.Provider>
  );
}
