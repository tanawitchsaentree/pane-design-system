import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'pane-tokens/css';
import 'pane-react/styles.css';
import './scenes.css';
import './docs.css';
import { App } from './App';
import { loadPage } from './book/load-page';
import { current } from './book/router';

// the first frame is the whole page: its chunks load before React renders anything (G-S5)
loadPage(current()).then(() => createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
));

// installable and readable offline: the worker is built by scripts/pwa.mjs, registered only in a production build
if (import.meta.env.PROD && 'serviceWorker' in navigator) window.addEventListener('load', () => { navigator.serviceWorker.register('/sw.js').catch(() => {}); });
