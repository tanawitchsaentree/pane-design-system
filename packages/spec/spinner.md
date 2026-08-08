# Spinner

## Usage
Spinner is an indeterminate loading indicator — a pure CSS animation with no client state, so it's safe to render on the server. Use it to communicate an in-progress/busy state, either standalone or composed inside Button (rendered automatically when `loading` is true).

## Do
- Provide a specific `label` (e.g. `"Saving changes"`) when the default `"Loading"` isn't descriptive enough for the context.
- Let Button render Spinner automatically via its `loading` prop rather than composing it manually inside a button.
- Match `size` to the surrounding icon/control scale (D-004 icon size tokens).

## Don't
- Don't rely on Spinner alone to convey busy state on an interactive control — pair it with `aria-busy`/`disabled` (as Button does) so assistive tech gets the full picture.
- Don't add a visible duplicate loading text next to Spinner — its own visually-hidden label already provides the accessible name.

## Accessibility
- **Keyboard:** N/A — Spinner is non-interactive and never receives focus.
- **Screen reader:** Root `span` has `role="status"` (implying `aria-live="polite"`), containing a visually-hidden label as real text content (not just an attribute) so the accessible name — `"Loading"` by default, or the custom `label` — is announced once.
- **Focus:** Not focusable; no focus-visible styling is defined. Respects `prefers-reduced-motion` by swapping the spin animation for an opacity pulse (D-009 motion tokens).

## Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `IconSizeToken` | `'md'` (20) | `size.icon.*` t-shirt scale (D-004). |
| `label` | `string` | `'Loading'` | Accessible label announced to assistive tech. |

## Related
- Button — composes Spinner automatically in its icon slot when `loading` is true.
- Skeleton — an alternative loading indicator pattern for content placeholders rather than an in-progress action.
