import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'pane-tokens/css';
import 'pane-react/styles.css';
import './scenes.css';
import './docs.css';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
