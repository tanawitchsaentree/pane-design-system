# Rating

## Usage
Rating renders a row of `max` native `<input type="radio">` elements sharing one `name`, visually replaced by star icons — the same native-radio-group technique `Radio`/`RadioCards` use, just with a repeated star glyph instead of a dot or a card. Use it for a discrete 1-`max` whole-star rating (e.g. picking a review score, or displaying an average).

## Do
- Give Rating a `name` — it groups the underlying native radios exactly like any other radio group.
- Use `value`/`onChange` for controlled usage, `defaultValue` for uncontrolled — `value` is a plain `number`, never a string or key.
- Use `readOnly` (not `disabled`) when displaying a rating the user can't change but might still want to inspect via keyboard/screen reader (e.g. "average rating left by others") — `readOnly` keeps every star focusable; `disabled` removes them from the tab order entirely.
- Always pass `aria-label` on the group (e.g. "Rate this product") — each individual star also carries its own `"{n} star(s) of {max}"` label, so the "out of {max}" context reaches screen reader users regardless of what the group label says.

## Don't
- Don't expect this component to support half-star or continuous values — it's a deliberate, flagged limitation, not an oversight. A native radio's value is one of N discrete, mutually-exclusive options; there's no native way to represent "2.5 stars." If that's ever needed, it requires a decision revisit (a different engine entirely, e.g. a slider primitive), not a silent change to this component.
- Don't assume `readOnly` behaves like the native `readonly` HTML attribute — `readonly` has no effect on `type="radio"` per the HTML spec (it's not on the IDL attribute list, unlike text inputs). Rating implements it instead by cancelling the browser's default click/arrow-key selection behavior.
- Don't rely on color alone to tell selected stars from unselected ones — see the Accessibility note on the shape-swap non-color cue.

## Accessibility
- **Keyboard:** arrow keys cycle selection between stars sharing the group's `name` — 100% native radio-group behavior, not implemented by this component. `readOnly` blocks this by calling `preventDefault()` in `onKeyDown` for Space/arrow/Home/End (and in `onClick` for pointer input) — **not covered by an automated jsdom test** (jsdom doesn't fully model native radio-group arrow-key selection, same honest limit `Radio.tsx` documents); proven instead in `packages/conformance/specs/w5-rating.spec.ts` running in a real browser.
- **Screen reader:** each star's own `aria-label` is `"{n} star(s) of {max}"`, set automatically — not left to the caller to wire up per star.
- **Non-color cue:** selected vs. unselected stars are a real shape swap — an outline-path `<svg>` and a filled-path `<svg>` sit as siblings inside each star, and exactly one is `display:block` at a time via `data-state`. This is deliberately not a single recolored glyph: under forced-colors mode, where `rating.star.selected`/`unselected`'s color tokens collapse to the same system color, the two stars remain structurally distinguishable by shape.
- **Hover preview:** hovering a star highlights it and every star before it, before the value commits. Implemented with plain React state (`onMouseEnter`/`onMouseLeave`) rather than the common CSS `:hover ~` sibling-selector shortcut — that shortcut typically pairs DOM order with *visual* order (via `flex-direction: row-reverse`) to make later-DOM-siblings highlight earlier ones while still reading left-to-right, which breaks under `dir="rtl"` (where "visually before" and "earlier in DOM order" stop matching). The state-driven version compares plain integer indices and never reasons about physical direction, so it needs no RTL-specific handling.
- **Focus:** each star's hit area (the `label` wrapping the hidden input) is ≥40px (`size.control.sm`), regardless of how much smaller the visible star glyph is (`size.icon.lg`, centered via flex) — same pattern as Radio/Checkbox/Switch.

## Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `number` | — | Controlled star count (`0`-`max`). |
| `defaultValue` | `number` | `0` | Initial value for uncontrolled usage. |
| `onChange` | `(value: number) => void` | — | Fires with the newly-selected star count. Never fires while `readOnly` or `disabled`. |
| `max` | `number` | `5` | Number of stars rendered. |
| `name` | `string` | — (required) | Groups the underlying native radios. |
| `disabled` | `boolean` | `false` | Removes every star from the tab order and blocks interaction. |
| `readOnly` | `boolean` | `false` | Displays the current value without allowing it to change; stars stay focusable. |
| `aria-label` | `string` | — (required) | Accessible name for the group. |

## Related
- `Radio`/`RadioCards` — sibling Standalone controls built on the exact same native-radio-group technique, just with a different visual repetition (ring+dot, card, star).
- `Listbox` — the Collection-family analog for choosing from a set, but modeling a keyed collection (`selectedKeys`) rather than one bounded integer, and built on React Aria instead of a bare native radio group.
