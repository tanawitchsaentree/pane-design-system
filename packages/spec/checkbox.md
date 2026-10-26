# Checkbox

## Usage
Checkbox renders a native `<input type="checkbox">`, visually hidden underneath a custom box drawn with real SVG check/indeterminate glyphs. It's the one selection control in this wave explicitly called out as not needing React Aria/Radix — a bare native checkbox already gets correct keyboard/focus behavior for free. Use it for boolean choices and "select all" style indeterminate groups.

## Do
- Use `indeterminate` for parent/"select all" checkboxes representing a partially-checked group of children — it's visual-only and does not affect the underlying `checked` value, so you own the logic for when to show it.
- Let the whole `label` be the click target — Checkbox's anatomy wraps the input and custom box in one `label`, extending the hit area.
- Pair with `Fieldset` when grouping several checkboxes that need a shared accessible group name.

## Don't
- Don't expect `indeterminate` to be a settable HTML attribute in JSX — it's a DOM-only property synced imperatively via a ref effect (`"use client"` is required for this reason), so it always requires client-side React.
- Don't assume the checked/indeterminate fill uses the brand accent color — per accent-scarcity rules it uses `role.neutral.solid`, since a checkbox list commonly shows several checked items per view.
- Don't rely on color alone to distinguish states — the checked and indeterminate states each render a distinct real SVG shape, not just a color swap.

## Accessibility
- **Keyboard:** Tab to focus, Space to toggle — both are native `<input type="checkbox">` behavior, verified directly in `Checkbox.test.tsx` (tab into the control, then `Space` fires `onChange`).
- **Screen reader:** The native input carries the real `checked`/`indeterminate`/`disabled` state and receives focus, so screen readers announce it exactly as a normal checkbox. When `indeterminate`, `aria-checked="mixed"` is also set explicitly. The custom visual box is `aria-hidden` and purely decorative on top of the real input.
- **Focus:** Focus-visible renders as an outline ring (`--ds-focus-ring-*` tokens) around the custom box, not a shadow. The wrapper (`label`) has `min-inline-size`/`min-block-size: size.control.sm` (40px) for a web-first hit area, while the visible box stays visually smaller (`size.icon.lg`) and centered within it via flex.

## Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `indeterminate` | `boolean` | `false` | Visual-only "partially checked" state; does not affect the underlying boolean `checked` value. |
| ...rest | `ComponentPropsWithoutRef<'input'>` (minus `type`, `size`) | — | Native checkbox props (`checked`, `defaultChecked`, `onChange`, `disabled`, `aria-label`, etc.) pass straight through. |

## Form goal
Control class (`system/FORM.md`, D-030): raised at rest via `shadow.raised.sm`, flipping to `shadow.inset.sm` when checked/indeterminate — same directional-shadow pattern as Button, applied to the box rather than a fill/border-only cue. D-031 (Foundry pick, Niche B) locks this as Dial's shipped treatment.

## Related
- `Radio` and `Switch` — the other two native-input-based selection controls, sharing the same visually-hidden-input + custom-visual technique and 40px hit-area pattern.
- `Fieldset` — groups multiple checkboxes/radios under a shared `<legend>`.
- `FormField` — can wrap a single Checkbox to attach a `Label`/`HelperText`, though checkboxes are more commonly labeled inline via their own wrapping `label`.
