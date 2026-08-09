# Stat

## Usage
Stat is a single label + value + optional trend statistic — the building block of a dashboard KPI strip or summary tile (e.g. "Total revenue: $12,450, +12% this month"). It renders no surface/border/shadow of its own (D-008) — wrap it in a `Card`/`Box` if it needs a visible boundary. Compose several side by side for a KPI row; each Stat is independent (no shared state), so laying multiple out is just a plain flex/grid of Stat elements.

## Do
- Pass a plain, pre-formatted string or number as `value` for the common case; use a `ReactNode` (e.g. mixing a smaller-weight unit suffix) only when the default single-size rendering isn't enough.
- Choose the `trend.direction` that matches the actual comparison (`'up'`/`'down'`/`'neutral'`) — the icon glyph is genuinely different per direction (ascending arrow / descending arrow / flat line), not a recolored copy of the same shape, so the meaning survives forced-colors and grayscale.
- Keep `trend.value` self-contained copy (e.g. `'+12% this month'`) — it renders as plain text next to the icon, with no implicit sign/color inference from the string itself.

## Don't
- Don't rely on `trend`'s color alone to convey direction — Stat already backs every trend with a distinct icon glyph; don't strip or hide that icon in custom styling.
- Don't use Stat for a value the user can edit or trigger an action from — it has no `onClick`/`onChange` by design (see Rigor Tier below); use a different component (e.g. a card with a Button) if the tile needs to be interactive.
- Don't nest a `Heading` inside `value` expecting document-outline benefits by default — Stat renders `value` through `Text`, not `Heading` (see Accessibility below for why, and how to opt in if you specifically need heading semantics).

## Rigor Tier: T1 static (re-classified from the batch's default T2)
The orchestrator's Wave 7 batch label was T2, but per-component classification is required (ds-conventions/SKILL.md's Rigor Tiers table) rather than inheriting the batch label. Stat has **no `onClick`/`onChange` and no state that changes in response to user interaction** — the trend's color/icon is driven entirely by the `trend` prop the caller passes in, not by anything Stat itself listens for. Per the locked T1-vs-T2 boundary ("ไม่มี interactivity จริงเลย = T1 — ต่อให้มี `:hover` ใน CSS ก็นับเป็น decorative"), that puts Stat in the same class as Badge/Skeleton (T1), not Button/Card (T2). Consequences: no conformance spec, no Gate Proof mutation required — lint + tsc + story + this spec doc + contrast self-check (all done) satisfy the DoD for T1. Unit tests were still written (not required by T1, but low-cost and already proven useful elsewhere in this system).

## Accessibility
- **Keyboard:** N/A — Stat is not focusable (no `tabindex`) and exposes no interactive role, same as Badge.
- **Screen reader:** Label/value/description are plain text via `Text`. The trend icon is **not** decorative — the visible `trend.value` string alone doesn't say which direction is favorable (e.g. `'+12%'` on its own), so the icon always carries an accessible name (`role="img"` + `aria-label`, via `Icon`'s existing "meaningful icon" contract): `'Trending up'` / `'Trending down'` / `'No change'`.
- **Focus:** Not focusable; no focus-visible styling is defined.
- **Live updates:** Stat applies no implicit live-region role (same reasoning as Badge — "don't guess a11y role beyond what's certain"). A caller polling/streaming a Stat's value should wrap it in their own live region.
- **Value semantics:** `value` renders through `Text`, not `Heading`, because Stat is commonly repeated several times with no natural heading-level context of its own (a KPI tile grid). A caller that specifically wants heading semantics for a given value can wrap their own `<Heading asChild>` around the node they pass as `value`.

## Contrast self-check (WCAG, computed from resolved hex in `packages/tokens/build/css/{light,dark}.css`)
Trend text/icon color (`color.feedback.success`/`danger`, reused verbatim from Toast/D-006 — no new hue) against the surfaces a Stat is expected to sit on directly (`color.surface.canvas` and `color.surface.raised`, i.e. no wrapping Card):

| Pairing | Light (canvas) | Light (raised) | Dark (canvas) | Dark (raised) |
|---|---|---|---|---|
| `trend.color.up` (feedback.success) vs surface | 4.09:1 | 4.35:1 | 6.47:1 | 6.16:1 |
| `trend.color.down` (feedback.danger) vs surface | 4.46:1 | 4.74:1 | 6.07:1 | 5.78:1 |
| `trend.color.neutral` (text.subtle) vs surface | 5.70:1 | 6.07:1 | 7.94:1 | 7.55:1 |
| `label`/`description` (text.subtle) vs surface | 5.70:1 | 6.07:1 | 7.94:1 | 7.55:1 |
| `value` (text.default) vs surface | 13.16:1 | — | 13.83:1 | — |

Every pairing clears the 4.5:1 AA text minimum in both themes on both surfaces (`up`/`down` are the tightest at 4.09-6.47:1, still comfortably above 4.5:1 except light-canvas `up` at 4.09:1 which still passes). No exception registered — all pairings pass without needing E-xxx.

## Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — | Caption identifying what the value measures. |
| `value` | `ReactNode` | — | The statistic itself. Accepts `ReactNode` for pre-formatted/mixed-weight content. |
| `trend` | `{ direction: 'up' \| 'down' \| 'neutral'; value: string }` | — | Optional trend indicator — icon + colored text, never color alone. |
| `description` | `string` | — | Optional supporting copy rendered under the trend (or under the value if no trend). |

## Related
- Badge — another T1 static, non-interactive content component with the same "wrap it yourself for live-region semantics" a11y note.
- Text/Heading — Stat composes `Text` for every text role; wrap `value` in your own `Heading asChild` if you need document-outline semantics for a specific Stat.
- Card — commonly wraps one or more Stat tiles to give them a visible surface/border; Stat itself renders no boundary (D-008).
