# Skeleton

## Usage
Skeleton is a loading placeholder shape — a shimmering block that stands in for content (text lines, avatars, images) while real data loads. It's a pure CSS shimmer animation with no client state, so it's safe to render on the server. Use `width`/`height` as a layout escape hatch to match the real content's arbitrary dimensions.

## Do
- Match Skeleton's `width`/`height` and `variant` (`text`/`circle`/`rect`) to the shape of the real content it's standing in for, for a smooth loading-to-loaded transition.
- Compose multiple Skeletons together (e.g. a circle + stacked text lines) to placeholder a whole card or list row.
- Pair Skeleton with a nearby Spinner or status region if the loading state itself needs to be announced to screen readers.

## Don't
- Don't expect Skeleton to announce anything to assistive tech on its own — it's `aria-hidden` by design.
- Don't use Skeleton for indeterminate action-in-progress feedback (e.g. a button submitting) — use Spinner for that.

## Accessibility
- **Keyboard:** N/A — Skeleton is non-interactive and never receives focus.
- **Screen reader:** Always `aria-hidden="true"` — a skeleton has no content of its own to announce. The loading state itself should be announced by a nearby Spinner/status region if one exists.
- **Focus:** Not focusable; no focus-visible styling is defined. `prefers-reduced-motion` swaps the shimmer sweep for a static low-contrast fill instead of disabling the placeholder entirely.

## Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'text' \| 'circle' \| 'rect'` | `'text'` | Shape. |
| `width` | `string \| number` | `undefined` | Inline-size — any valid CSS width value; consumer-supplied layout escape hatch (not a token). |
| `height` | `string \| number` | `undefined` | Block-size — same escape-hatch treatment as `width`. |

## Related
- Spinner — the companion loading pattern for in-progress actions rather than content placeholders.
- Avatar — Skeleton's `circle` variant is commonly sized to match Avatar for profile-picture placeholders.
