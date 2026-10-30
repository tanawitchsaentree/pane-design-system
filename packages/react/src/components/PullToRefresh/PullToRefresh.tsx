import { forwardRef, useRef, useState, type HTMLAttributes } from 'react';
import { cx } from '../../cx';
import { Spinner } from '../Spinner';
import styles from './PullToRefresh.module.css';
import { useMessages } from '../../i18n/context';

export interface PullToRefreshProps extends HTMLAttributes<HTMLDivElement> {
  /** Called when the reader pulls past the threshold or presses the refresh button. Return a promise; the spinner stays until it settles. */
  onRefresh: () => Promise<unknown> | void;
  /** What refreshing does, for the button and the spinner, such as Refresh messages. */
  label?: string;
}

/** A scrolling list that refreshes when it is pulled down from the top. Pulling is a gesture, so a
 *  Refresh button is always there too (WCAG 2.5.1); it shows when focused, for keyboards and switches. */
export const PullToRefresh = forwardRef<HTMLDivElement, PullToRefreshProps>(function PullToRefresh({ onRefresh, label: labelIn, className, children, ...rest }, ref) {
  const t = useMessages();
  const label = labelIn ?? t.refresh;
  const [pull, setPull] = useState(0);
  const [busy, setBusy] = useState(false);
  const start = useRef<number | null>(null);
  const box = useRef<HTMLDivElement | null>(null);
  const THRESHOLD = 64;
  const run = async () => { if (busy) return; setBusy(true); try { await onRefresh(); } finally { setBusy(false); setPull(0); } };
  return (
    <div ref={(n) => { box.current = n; if (typeof ref === 'function') ref(n); else if (ref) ref.current = n; }} data-component="PullToRefresh" aria-busy={busy || undefined} className={cx(styles.root, className)}
      onPointerDown={(e) => { if (e.pointerType !== 'mouse' && (box.current?.scrollTop ?? 0) <= 0) start.current = e.clientY; }}
      onPointerMove={(e) => { if (start.current == null || busy) return; setPull(Math.max(0, Math.min(THRESHOLD * 1.5, (e.clientY - start.current) / 2))); }}
      onPointerUp={() => { if (start.current == null) return; start.current = null; if (pull >= THRESHOLD) run(); else setPull(0); }}
      onPointerCancel={() => { start.current = null; setPull(0); }}
      {...rest}>
      <button type="button" className={styles.button} onClick={run} disabled={busy}>{label}</button>
      <div className={styles.indicator} style={{ blockSize: busy ? THRESHOLD : pull }} aria-hidden={!busy}>
        {(busy || pull > 0) && <Spinner size="sm" label={busy ? `${label}…` : label} className={pull >= THRESHOLD || busy ? styles.ready : styles.pulling} />}
      </div>
      {children}
    </div>
  );
});
