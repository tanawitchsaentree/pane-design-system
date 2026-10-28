# Pane

A spatial-glass design system for React: clear, blurred glass panes over a real scene, with every
line of text measured for contrast, per pixel, in light and dark.

- **pane-react** — 26 React components (layout, actions, status, the forms set, Select, Slider,
  Tabs, Banner and more). The tokens are bundled inside, so it is the only package you need.
- **pane-tokens** — the design tokens on their own (CSS custom properties, JSON, ESM with types,
  SCSS), three tiers from DTCG sources, for projects that are not React.
- **The docs book** (`apps/docs`) — every component at depth (usage, style, code, accessibility),
  the foundations with live playgrounds, patterns and the full token reference.

## Use it

```bash
npm install pane-react
```

```tsx
import 'pane-react/all.css';   // tokens and component styles, once at the root
import { Environment, Container, Card, Button } from 'pane-react';

export function App() {
  return (
    <Environment brightness="bright">
      <Container>
        <Card as="section" aria-labelledby="t">
          <h2 id="t">Lysefjord</h2>
          <Button>Follow</Button>
        </Card>
      </Container>
    </Environment>
  );
}
```

Until the packages are published, build a tarball and install that file:

```bash
pnpm install
pnpm run release:pack                      # → release/pane-react-<version>.tgz
npm install /path/to/release/pane-react-<version>.tgz   # in the other project
```

## Work on it

```bash
pnpm install
pnpm run tokens:build     # packages/tokens → build/
pnpm run docs:dev         # the docs book with hot reload
pnpm run docs:build       # builds pane-react, then the book into apps/docs/dist
```

| Path | What it is |
|---|---|
| `packages/tokens` | DTCG token sources (`src/*.json`) and the build |
| `packages/react` | the components, one folder each, with their reasons (`<Name>.why.json`) |
| `apps/docs` | the docs book (Vite + React) |
| `system/` | the concept, decisions, exceptions and the review log behind every choice |

React 18 or newer. Light and dark themes; reduced motion and forced colours are supported.

## Licence

MIT, see [LICENSE](LICENSE). Scene photographs are from Unsplash and are credited in the book’s
Credits page.
