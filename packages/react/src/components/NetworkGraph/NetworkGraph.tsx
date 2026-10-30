import { forwardRef, useMemo, useState, type KeyboardEvent } from 'react';
import { ChartFrame, seriesVar, useWidth } from '../../chart/core';
import c from '../../chart/Chart.module.css';
import { cx } from '../../cx';
import { useMessages } from '../../i18n/context';
import styles from './NetworkGraph.module.css';

export interface GraphNode { id: string; label: string; group?: number }
export interface GraphEdge { from: string; to: string; label?: string; weight?: number }

export interface NetworkGraphProps {
  /** The graph's title; it names the figure and the plot. */
  label: string;
  /** A line under the title that says what the nodes and links are. */
  description?: string;
  /** The nodes; `group` (0 to 7) picks a data colour, so a kind of node keeps one colour everywhere. */
  nodes: GraphNode[];
  /** The links between nodes; `weight` thickens a link, `label` names it in the table and the tooltip. */
  edges: GraphEdge[];
  /** `mini` (no labels, small) for a preview in a card or a row; `full` (default) labels every node. */
  size?: 'mini' | 'full';
  /** The plot's height in pixels; 320 by default, 120 for mini. */
  blockSize?: number;
  /** Called with a node's id when the reader chooses it. */
  onSelect?: (id: string) => void;
  /** Extra class on the figure. */
  className?: string;
}

// a small force layout, run to rest before the first paint: nodes repel, links pull, everything is held to the box
function layout(nodes: GraphNode[], edges: GraphEdge[], w: number, h: number) {
  const n = nodes.length; if (!n) return new Map<string, [number, number]>();
  const P = nodes.map((_, i) => [w / 2 + Math.cos((i / n) * Math.PI * 2) * w * 0.3, h / 2 + Math.sin((i / n) * Math.PI * 2) * h * 0.3]);
  const idx = new Map(nodes.map((x, i) => [x.id, i])); const L = edges.map((e) => [idx.get(e.from), idx.get(e.to)]).filter(([a, b]) => a !== undefined && b !== undefined) as [number, number][];
  const k = Math.sqrt((w * h) / n) * 0.7;
  for (let it = 0; it < 220; it++) {
    const D = P.map(() => [0, 0]); const t = (1 - it / 220) * k * 0.2;
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { const dx = P[i][0] - P[j][0], dy = P[i][1] - P[j][1]; const d = Math.max(1, Math.hypot(dx, dy)); const f = (k * k) / d; D[i][0] += (dx / d) * f; D[i][1] += (dy / d) * f; D[j][0] -= (dx / d) * f; D[j][1] -= (dy / d) * f; }
    for (const [a, b] of L) { const dx = P[a][0] - P[b][0], dy = P[a][1] - P[b][1]; const d = Math.max(1, Math.hypot(dx, dy)); const f = (d * d) / k; D[a][0] -= (dx / d) * f; D[a][1] -= (dy / d) * f; D[b][0] += (dx / d) * f; D[b][1] += (dy / d) * f; }
    for (let i = 0; i < n; i++) { const d = Math.max(1, Math.hypot(D[i][0], D[i][1])); P[i][0] = Math.min(w - 24, Math.max(24, P[i][0] + (D[i][0] / d) * Math.min(d, t))); P[i][1] = Math.min(h - 24, Math.max(24, P[i][1] + (D[i][1] / d) * Math.min(d, t))); }
  }
  return new Map(nodes.map((x, i) => [x.id, P[i] as [number, number]]));
}

/** Nodes and the links between them, laid out by a small force simulation before the first paint. Every
 *  node is reachable by keyboard: arrow keys walk to the nearest node that way, Enter chooses, and the
 *  focused node's links are drawn at full strength while the rest recede. The table view lists every node
 *  and every link, so the graph is never only a picture. `mini` is the preview used in cards. */
export const NetworkGraph = forwardRef<HTMLElement, NetworkGraphProps>(function NetworkGraph({ label, description, nodes, edges, size = 'full', blockSize, onSelect, className }, _ref) {
  const t = useMessages();
  const [box, width] = useWidth<HTMLDivElement>();
  const mini = size === 'mini'; const H = blockSize ?? (mini ? 120 : 320);
  const pos = useMemo(() => layout(nodes, edges, Math.max(160, width || 320), H), [nodes, edges, width, H]);
  const [at, setAt] = useState<string | null>(null);
  const near = new Set(at ? edges.flatMap((e) => (e.from === at ? [e.to] : e.to === at ? [e.from] : [])) : []);
  const key = (e: KeyboardEvent) => {
    if (!nodes.length) return;
    if (e.key === 'Enter' && at) { e.preventDefault(); onSelect?.(at); return; }
    if (e.key === 'Escape') { setAt(null); return; }
    const dir: Record<string, [number, number]> = { ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowDown: [0, 1], ArrowUp: [0, -1] };
    const d = dir[e.key]; if (!d) return; e.preventDefault();
    if (!at) { setAt(nodes[0].id); return; }
    const [x0, y0] = pos.get(at)!; let best: string | null = null, score = Infinity;
    for (const nd of nodes) { if (nd.id === at) continue; const [x, y] = pos.get(nd.id)!; const dx = x - x0, dy = y - y0; const along = dx * d[0] + dy * d[1]; if (along <= 0) continue; const s = Math.hypot(dx, dy) + Math.abs(dx * d[1] - dy * d[0]) * 2; if (s < score) { score = s; best = nd.id; } }
    if (best) setAt(best);
  };
  const byId = new Map(nodes.map((x) => [x.id, x]));
  const plot = (
    <div ref={box} className={c.plot} tabIndex={0} role="group" aria-roledescription={t.chart} aria-label={t.graphSummary(label, nodes.length, edges.length)} onKeyDown={key} onBlur={() => setAt(null)}>
      {width > 0 && (
        <svg className={c.svg} width={width} height={H} aria-hidden="true">
          {edges.map((e, i) => { const a = pos.get(e.from), b = pos.get(e.to); if (!a || !b) return null; const on = at && (e.from === at || e.to === at); return <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} className={cx(styles.edge, at && !on && styles.faded, on && styles.on)} style={{ strokeWidth: `calc(var(--ds-width-hairline) * ${Math.min(4, 1 + (e.weight ?? 0))})` }} />; })}
          {nodes.map((nd) => { const [x, y] = pos.get(nd.id)!; const on = nd.id === at, rel = near.has(nd.id); return (
            <g key={nd.id} className={cx(styles.node, at && !on && !rel && styles.faded)} onPointerEnter={() => setAt(nd.id)} onClick={() => onSelect?.(nd.id)}>
              <circle cx={x} cy={y} r={mini ? 4 : 7} className={styles.dot} data-on={on || undefined} style={{ fill: seriesVar(nd.group ?? 0) }} />
              {!mini && <text x={x} y={y + 20} textAnchor="middle" className={on ? c.label : c.tick}>{nd.label}</text>}
            </g>); })}
        </svg>
      )}
    </div>
  );
  return (
    <ChartFrame component="NetworkGraph" label={label} description={mini ? undefined : description} className={className} series={[]}
      table={{ head: [t.from, t.to, t.link], rows: edges.map((e) => [byId.get(e.from)?.label ?? e.from, byId.get(e.to)?.label ?? e.to, e.label ?? '']) }}>
      {plot}
      <span className={styles.live} aria-live="polite">{at ? t.graphNode(byId.get(at)?.label ?? at, near.size) : ''}</span>
    </ChartFrame>
  );
});
