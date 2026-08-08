# Badge

## Usage
Badge is a small, non-interactive label for status/category/count indicators (e.g. "New", "Beta", a count chip). It supports three fill treatments (`solid`/`subtle`/`outline`) and the full set of semantic color roles (D-006). It is never focusable and has no hover/active state — it's content, not a control.

## Do
- Default to `variant='subtle'` (the quietest option) unless a stronger visual weight is specifically needed.
- Use `color='brand'` deliberately and occasionally — it's an informational tint, not subject to the same accent-scarcity rule as interactive elements, but still shouldn't be overused.
- Wrap Badge yourself in a live region if the value needs to announce updates — Badge intentionally does not apply `role="status"` by default since most badges are static labels.

## Don't
- Don't make Badge interactive (clickable/focusable) — use Button or a link if the label needs to respond to interaction.
- Don't assume Badge announces changes to screen readers automatically — it has no implicit live-region role.

## Accessibility
- **Keyboard:** N/A — Badge is not focusable (no `tabindex`) and exposes no interactive role.
- **Screen reader:** No implicit ARIA role beyond its plain text content; `role="status"` is intentionally omitted by default per BLUEPRINT §7 ("don't guess a11y role beyond what's certain") — consumers needing live-updating semantics should wrap the value in their own live region.
- **Focus:** Not focusable; no focus-visible styling is defined.

## Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'solid' \| 'subtle' \| 'outline'` | `'subtle'` | Fill treatment; `'subtle'` is the quietest, matching the accent-scarcity default. |
| `color` | `ColorRoleToken` | `'neutral'` | Color role (D-006). |
| `size` | `'sm' \| 'md'` | `'md'` | Size. |
| `children` | `ReactNode` | — | Badge content. |

## Related
- Kbd — another small non-interactive inline label, for keyboard keys specifically.
- Avatar — often paired with a Badge (e.g. a status dot) in composed UI, though not directly composed by Badge itself.

## Notes
Per D-014, Badge's `solid` variant text color uses the `color.text.onRoleSolid` semantic token (rather than a hardcoded white), which flips between light/dark per theme to keep solid-fill badge text at WCAG AA contrast across all color roles in both themes.
