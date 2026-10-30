import { forwardRef, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../cx';
import styles from './TreeView.module.css';

export interface TreeNode {
  /** Unique within the tree; it is what `value` and `expanded` hold. */
  id: string;
  /** The row's text. */
  label: string;
  /** A glyph before the label, such as a folder; it is not read. */
  icon?: ReactNode;
  /** The nodes inside this one; a node with children opens and closes. */
  children?: TreeNode[];
}

export interface TreeViewProps {
  /** Names the tree for screen readers, such as Folders. */
  label: string;
  /** The top-level nodes. */
  nodes: TreeNode[];
  /** The chosen node's id, when you keep it yourself. */
  value?: string | null;
  /** The node chosen at the start. */
  defaultValue?: string | null;
  /** Called with the id of the node the reader chooses with a press, Enter or Space. */
  onValueChange?: (id: string) => void;
  /** The ids open at the start. */
  defaultExpanded?: string[];
  /** Extra class on the tree. */
  className?: string;
}

type Row = { node: TreeNode; level: number; parent: string | null; setSize: number; pos: number };

/** Nested rows that open and close, such as folders. It is a real tree for the keyboard: up and down move,
 *  right opens or goes in, left closes or goes out, Home and End jump, and typing a letter finds the next
 *  row that starts with it. The chosen row is Sidebar's chosen pane and a chevron turns as a node opens. */
export const TreeView = forwardRef<HTMLUListElement, TreeViewProps>(function TreeView({ label, nodes, value, defaultValue, onValueChange, defaultExpanded = [], className }, ref) {
  const [open, setOpen] = useState(() => new Set(defaultExpanded));
  const [inner, setInner] = useState<string | null>(defaultValue ?? null);
  const chosen = value !== undefined ? value : inner;
  const rows = useMemo(() => {
    const out: Row[] = [];
    const walk = (list: TreeNode[], level: number, parent: string | null) => list.forEach((n, i) => { out.push({ node: n, level, parent, setSize: list.length, pos: i + 1 }); if (n.children && open.has(n.id)) walk(n.children, level + 1, n.id); });
    walk(nodes, 1, null); return out;
  }, [nodes, open]);
  const [focus, setFocus] = useState<string>(() => chosen ?? nodes[0]?.id);
  const els = useRef(new Map<string, HTMLLIElement>());
  const move = (id: string) => { setFocus(id); els.current.get(id)?.focus(); };
  const toggle = (id: string, to?: boolean) => setOpen((s) => { const n = new Set(s); const want = to ?? !n.has(id); if (want) n.add(id); else n.delete(id); return n; });
  const choose = (id: string) => { if (value === undefined) setInner(id); onValueChange?.(id); };
  const key = (e: KeyboardEvent, r: Row, i: number) => {
    const has = !!r.node.children?.length; const isOpen = open.has(r.node.id);
    const rtl = getComputedStyle(e.currentTarget).direction === 'rtl';
    const k = rtl && e.key === 'ArrowLeft' ? 'ArrowRight' : rtl && e.key === 'ArrowRight' ? 'ArrowLeft' : e.key;
    const act: Record<string, () => void> = {
      ArrowDown: () => rows[i + 1] && move(rows[i + 1].node.id),
      ArrowUp: () => rows[i - 1] && move(rows[i - 1].node.id),
      ArrowRight: () => { if (has && !isOpen) toggle(r.node.id, true); else if (has) move(r.node.children![0].id); },
      ArrowLeft: () => { if (has && isOpen) toggle(r.node.id, false); else if (r.parent) move(r.parent); },
      Home: () => move(rows[0].node.id), End: () => move(rows[rows.length - 1].node.id),
      Enter: () => choose(r.node.id), ' ': () => choose(r.node.id),
    };
    if (act[k]) { e.preventDefault(); e.stopPropagation(); act[k](); return; }
    if (e.key.length === 1 && /\S/.test(e.key)) {
      const after = [...rows.slice(i + 1), ...rows.slice(0, i + 1)];
      const hit = after.find((x) => x.node.label.toLowerCase().startsWith(e.key.toLowerCase()));
      if (hit) move(hit.node.id);
    }
  };
  const render = (list: TreeNode[], level: number): ReactNode => list.map((n) => {
    const i = rows.findIndex((r) => r.node.id === n.id); const r = rows[i];
    const has = !!n.children?.length; const isOpen = open.has(n.id);
    return (
      <li key={n.id} ref={(el) => { if (el) els.current.set(n.id, el); else els.current.delete(n.id); }} role="treeitem" aria-level={level} aria-setsize={r.setSize} aria-posinset={r.pos}
        aria-expanded={has ? isOpen : undefined} aria-selected={chosen === n.id} tabIndex={focus === n.id ? 0 : -1} className={styles.item}
        onKeyDown={(e) => { if (e.target === e.currentTarget) key(e, r, i); }} onFocus={(e) => { if (e.target === e.currentTarget) setFocus(n.id); }}>
        <div className={cx(styles.row, chosen === n.id && styles.chosen)} style={{ ['--pane-level' as string]: level - 1 }}
          onClick={() => { move(n.id); if (has) toggle(n.id); choose(n.id); }}>
          <span className={cx(styles.chevron, has && isOpen && styles.open)} aria-hidden="true">{has && <svg viewBox="0 0 16 16"><path d="M6 3.5 10.5 8 6 12.5" /></svg>}</span>
          {n.icon && <span className={styles.icon} aria-hidden="true">{n.icon}</span>}
          <span className={styles.label}>{n.label}</span>
        </div>
        {has && isOpen && <ul role="group" className={styles.group}>{render(n.children!, level + 1)}</ul>}
      </li>
    );
  });
  return <ul ref={ref} role="tree" aria-label={label} data-component="TreeView" className={cx(styles.root, className)}>{render(nodes, 1)}</ul>;
});
