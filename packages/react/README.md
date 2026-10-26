# pane-react

React components for **Pane** — clear, blurred glass panes over a real scene, held to measured WCAG
contrast.

```bash
npm install pane-tokens pane-react   # React 18+
```

```tsx
import 'pane-tokens/css';
import 'pane-react/styles.css';
import { Environment, Container, Grid, GridItem, Card, Button, Badge } from 'pane-react';

export function App() {
  return (
    <Environment brightness="bright">           {/* how bright the scene behind the glass gets */}
      <Container>
        <Grid>
          <GridItem span="full" lg={8}>
            <Card as="section" aria-labelledby="t">
              <h2 id="t">Welcome back</h2>
              <Badge tone="positive">Live</Badge>
              <Button>Open feed</Button>
            </Card>
          </GridItem>
        </Grid>
      </Container>
    </Environment>
  );
}
```

Components: **layout** Container · Grid / GridItem · Stack — **surfaces** Environment · Card /
CardCover — **content** Avatar · Tag · Badge · Banner — **actions** Button · IconButton · Chip ·
Tabs.

- Put a scene image behind the app; text always sits on a `Card`.
- New background image? Measure it with `tooling/glass-sweep.mjs` and set `Environment` to match.
- ESM + CJS + `.d.ts`; one stylesheet; Radix Tabs is the only runtime dependency besides
  `pane-tokens`.
