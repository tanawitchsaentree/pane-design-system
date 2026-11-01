// @example The same code in IDE palettes
import { Card, CodeBlock } from 'pane-react';

const code = `.my-pane {
  /* glass over the scene */
  backdrop-filter: blur(32px);
  border-radius: var(--ds-corner-panel);
}`;

export default function CodeThemes() {
  return (
    <Card as="div" className="demo-card demo-wide">
      {['github-dark', 'one-dark', 'dracula', 'github-light', 'solarized-light'].map((t) => <CodeBlock key={t} label={t} language="css" codeTheme={t} code={code} />)}
    </Card>
  );
}
