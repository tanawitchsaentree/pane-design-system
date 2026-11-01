// @example A terminal line and a config file
import { Card, CodeBlock } from 'pane-react';

export default function CodeTerminal() {
  return (
    <Card as="div" className="demo-card demo-wide">
      <CodeBlock label="Terminal" language="bash" code={'# add Pane to a project\nnpm install ./pane-react-0.7.0.tgz'} />
      <CodeBlock label="JSON" language="json" code={'{\n  "name": "Harbor",\n  "density": "compact",\n  "motion": "brisk"\n}'} />
    </Card>
  );
}
