# pane-tokens

Design tokens for **Pane**, the spatial-glass design system — 3 tiers (primitive → semantic →
component), built from DTCG JSON.

```bash
npm install pane-tokens            # or the tarball from `pnpm run release:pack`
```

| Import | Contents |
|---|---|
| `pane-tokens/css` | Every `--ds-*` custom property, environment blocks (`[data-environment]`), responsive layout blocks (4 → 8 → 12 columns at 768 / 1024px), grid span rules, and fallbacks for reduced transparency, forced colours, no `backdrop-filter` and reduced motion |
| `pane-tokens/js` | ESM `tokens` (resolved values) and `cssVar` (`var()` references), typed with `TokenName` |
| `pane-tokens/scss` | `$ds-*` (var() references) and `$ds-raw-*` (resolved values, for media queries) |
| `pane-tokens/json` | Every token with tier, type, reference and resolved value |

```css
@import 'pane-tokens/css';
.panel { padding: var(--ds-gap-inset); border-radius: var(--ds-corner-panel); }
.layout { display: grid; grid-template-columns: repeat(var(--ds-grid-columns), minmax(0, 1fr)); gap: var(--ds-grid-gutter); }
```

```ts
import { tokens, cssVar } from 'pane-tokens/js';
tokens['space.6'];       // "24px"
cssVar['card.radius'];   // "var(--ds-card-radius)"
```

Use `var()`/`cssVar` in styles (they follow environments and breakpoints); use resolved values only
where custom properties can't go (media queries, canvas). Full reference: the Pane docs, chapter
*Reference → Tokens*.
