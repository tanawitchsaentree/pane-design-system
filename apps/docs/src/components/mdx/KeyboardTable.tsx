export interface KeyboardEntry {
  key: string;
  action: string;
}

/**
 * Per docs/DOCS-IA.md point 9: only rendered for components whose spec's Accessibility section
 * names specific keys. A component with no named keyboard behavior beyond native Tab gets a
 * one-line note instead — see the MDX page for that component, not this component, since the
 * decision of which to render is made per-page from the spec content.
 */
export function KeyboardTable({ entries }: { entries: KeyboardEntry[] }) {
  return (
    <table className="docs-keyboard-table">
      <thead>
        <tr>
          <th>Key</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry) => (
          <tr key={entry.key}>
            <td>
              <kbd>{entry.key}</kbd>
            </td>
            <td>{entry.action}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
