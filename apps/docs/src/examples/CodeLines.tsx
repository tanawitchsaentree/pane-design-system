// @example Line numbers and a long file
import { Card, CodeBlock } from 'pane-react';

const code = Array.from({ length: 22 }, (_, i) => `  --ds-gap-${i + 1}: ${(i + 1) * 4}px;`).join('\n');

export default function CodeLines() {
  return <Card as="div" className="demo-card demo-wide"><CodeBlock label="CSS" language="css" lineNumbers lines={8} code={`:root {\n${code}\n}`} /></Card>;
}
