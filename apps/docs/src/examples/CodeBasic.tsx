// @example A snippet in colour
import { Card, CodeBlock } from 'pane-react';

const code = `import { Button } from 'pane-react';

export function Save() {
  return <Button variant="glass" onClick={save}>Save</Button>;
}`;

export default function CodeBasic() {
  return <Card as="div" className="demo-card demo-wide"><CodeBlock label="TSX" code={code} /></Card>;
}
