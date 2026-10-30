import { forwardRef, type HTMLAttributes, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../cx';
import { useMessages } from '../../i18n/context';
import styles from './NodeCard.module.css';

export interface NodeCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'onSelect'> {
  /** The node's name, such as Account 4471 or Witness statement. */
  title: string;
  /** A line under the name, such as a kind, a date or a count. */
  meta?: ReactNode;
  /** A glyph or an avatar at the start of the header; it is not read. */
  icon?: ReactNode;
  /** What the node holds, shown unless the node is collapsed. */
  children?: ReactNode;
  /** Marks the node the reader picked with chosen glass and a ring, and says so with aria-current. */
  selected?: boolean;
  /** Set while the node is moved, so it lifts one level like a card picked up. */
  dragging?: boolean;
  /** Shows only the header; `onToggle` adds the button that opens it again. */
  collapsed?: boolean;
  /** Called by the collapse button in the header. */
  onToggle?: () => void;
  /** Called when the node is chosen by a press, Enter or Space. */
  onSelect?: () => void;
  /** Called with a step when the node is moved by the arrow keys (with Shift, ten steps), so a canvas can move it. */
  onMove?: (dx: number, dy: number) => void;
  /** How many connection points on each side, drawn as small dots on the edges where lines attach. */
  ports?: { in?: number; out?: number };
}

/** A node on a canvas: a small level-2 pane with a header (glyph, name, a line of meta), its body, and the
 *  dots where edges attach. It is one tab stop; Enter or Space chooses it, arrow keys move it by a step
 *  (Shift for ten), so a graph can be built without a pointer. Chosen is chosen glass and a ring (P6). */
export const NodeCard = forwardRef<HTMLDivElement, NodeCardProps>(function NodeCard({ title, meta, icon, children, selected, dragging, collapsed, onToggle, onSelect, onMove, ports, className, onKeyDown, ...rest }, ref) {
  const t = useMessages();
  const key = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e); if (e.defaultPrevented || e.target !== e.currentTarget) return;
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect?.(); return; }
    const k = e.shiftKey ? 10 : 1; const m: Record<string, [number, number]> = { ArrowLeft: [-k, 0], ArrowRight: [k, 0], ArrowUp: [0, -k], ArrowDown: [0, k] };
    if (m[e.key] && onMove) { e.preventDefault(); onMove(...m[e.key]); }
  };
  const dots = (n = 0, side: 'in' | 'out') => Array.from({ length: n }, (_, i) => <span key={`${side}${i}`} className={cx(styles.port, styles[side])} style={{ ['--pane-port' as string]: `${((i + 1) / (n + 1)) * 100}%` }} aria-hidden="true" data-port={`${side}-${i}`} />);
  return (
    <div ref={ref} data-component="NodeCard" role="group" aria-roledescription={t.node} aria-label={title} aria-current={selected || undefined} tabIndex={0}
      data-selected={selected || undefined} data-dragging={dragging || undefined} className={cx(styles.root, className)} onKeyDown={key} onClick={(e) => { if (e.target === e.currentTarget || !(e.target as HTMLElement).closest('button')) onSelect?.(); }} {...rest}>
      {dots(ports?.in, 'in')}{dots(ports?.out, 'out')}
      <div className={styles.head} data-part="head">
        {icon && <span className={styles.icon} aria-hidden="true">{icon}</span>}
        <span className={styles.titles}><span className={styles.title}>{title}</span>{meta && <span className={styles.meta}>{meta}</span>}</span>
        {onToggle && (
          <button type="button" className={styles.toggle} aria-expanded={!collapsed} aria-label={collapsed ? t.expand(title) : t.collapse(title)} onClick={(e) => { e.stopPropagation(); onToggle(); }}>
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 6l4 4 4-4" /></svg>
          </button>
        )}
      </div>
      {!collapsed && children != null && <div className={styles.body}>{children}</div>}
    </div>
  );
});
