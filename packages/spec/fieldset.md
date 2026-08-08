# Fieldset

## Usage
Fieldset is a native `<fieldset>` + `<legend>` wrapper for a related group of controls, most commonly a Radio group. It renders its legend copy through `Text` rather than re-declaring typography, and its `disabled` prop uses the native fieldset-disabled cascade to disable every nested control at once.

## Do
- Always provide a `legend` — a fieldset without one has no accessible group name, which is why the prop is required rather than optional.
- Use `disabled` to disable an entire group of controls in one place instead of wiring `disabled` onto every child individually.
- Compose Fieldset around a `Radio` group (or checkbox group) to give it a proper accessible group name.

## Don't
- Don't hand-wire `disabled` on each child control when a whole group should be disabled — the native `<fieldset disabled>` cascade already handles it and removes them from the tab order.
- Don't put a single, unrelated control inside a Fieldset — it's for grouping, not a generic bordered box.
- Don't rewrite the legend's font styling — it already renders through `Text` (`size="sm" weight="semibold"`).

## Accessibility
- **Keyboard:** No independent keyboard behavior of its own; when `disabled`, every nested native form control is removed from the tab order automatically via the native fieldset cascade.
- **Screen reader:** `<legend>` is the group's accessible name — assistive tech announces it before each control's own label, exposing the fieldset as `role="group"` with that name (verified in `Fieldset.test.tsx` via `getByRole('group', { name: ... })`). The native `disabled` attribute communicates the disabled state for all nested controls with no extra prop-drilling.
- **Focus:** Not focusable itself; focus moves to/among its nested controls as usual, respecting the disabled cascade.

## Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `legend` | `string` | — (required) | Rendered inside the native `<legend>`. |
| `disabled` | `boolean` | `false` | Disables every nested form control via the native `<fieldset disabled>` cascade. |
| `children` | `ReactNode` | — | Grouped controls. |

## Related
- `Radio` — the most common control grouped inside Fieldset, since a radio group's shared `name` needs a legend for its accessible group name.
- `Checkbox` — can also be grouped inside Fieldset when several checkboxes represent one logical question.
- `Text` — Fieldset's legend renders through `Text` for consistent typography.
