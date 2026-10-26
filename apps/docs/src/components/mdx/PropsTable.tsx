import { getPropsDoc } from '@/lib/propsTable';

/**
 * Renders a component's real TypeScript prop types as a table. Server component — runs at build
 * time only (this app is statically exported), reading packages/react/src/{componentPath} via
 * react-docgen-typescript. Never a hand-typed table.
 */
export function PropsTable({
  componentPath,
  displayName,
}: {
  componentPath: string;
  displayName?: string;
}) {
  const props = getPropsDoc(componentPath, displayName);

  if (props.length === 0) {
    return <p className="docs-placeholder">This component takes no props beyond native element attributes.</p>;
  }

  return (
    <table className="docs-props-table">
      <thead>
        <tr>
          <th>Prop</th>
          <th>Type</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {props.map((prop) => (
          <tr key={prop.name}>
            <td>
              <code>
                {prop.name}
                {prop.required ? '' : '?'}
              </code>
            </td>
            <td>
              <code>{prop.type}</code>
            </td>
            <td>{prop.defaultValue ? <code>{prop.defaultValue}</code> : '—'}</td>
            <td>{prop.description || '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
