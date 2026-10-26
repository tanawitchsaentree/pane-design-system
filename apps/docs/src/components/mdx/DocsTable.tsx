import type { TableHTMLAttributes, ReactElement, ReactNode } from 'react';
import { isValidElement, Children } from 'react';

/**
 * docs-engine craft-contract TABLE PATTERN — the shared component every comparison/matrix table
 * renders through (registered globally as MDX's own `table` override, `mdx-components.tsx`),
 * matching the Bootstrap containers-matrix convention expressed in this system's own tokens:
 * header row treatment, row rules from tokens, first-column mono where that column names a real
 * code identifier (detected heuristically below — a cell whose entire content is exactly one
 * inline `<code>` element).
 *
 * MDX's own remark-gfm renders a `| a | b |` block as a plain `<table><thead>...<tbody>...`
 * structure (real elements, not a hand-copied HTML string) — this component only adds the shared
 * visual treatment on top of that real structure, same as CodePanel wraps rehypeCode's real
 * output rather than re-parsing anything itself.
 */
export function DocsTable({ children, ...rest }: TableHTMLAttributes<HTMLTableElement>) {
  const rows = extractBodyRows(children);
  const firstColumnIsCode = rows.length > 0 && rows.every((row) => isSingleCodeCell(row[0]));

  return (
    <table className={`docs-table${firstColumnIsCode ? ' docs-table-mono-first-col' : ''}`} {...rest}>
      {children}
    </table>
  );
}

function extractBodyRows(children: ReactNode): ReactNode[][] {
  const rows: ReactNode[][] = [];
  Children.forEach(children, (section) => {
    if (!isValidElement(section) || section.type !== 'tbody') return;
    Children.forEach((section.props as { children?: ReactNode }).children, (row) => {
      if (!isValidElement(row)) return;
      const cells = Children.toArray((row.props as { children?: ReactNode }).children);
      rows.push(cells);
    });
  });
  return rows;
}

function isSingleCodeCell(cell: ReactNode): boolean {
  if (!isValidElement(cell)) return false;
  const cellChildren = Children.toArray((cell.props as { children?: ReactNode }).children).filter(
    (c) => !(typeof c === 'string' && c.trim() === ''),
  );
  return cellChildren.length === 1 && isValidElement(cellChildren[0]) && (cellChildren[0] as ReactElement).type === 'code';
}
