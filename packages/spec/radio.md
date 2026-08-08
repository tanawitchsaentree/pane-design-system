# Radio

## Usage
Radio renders a native `<input type="radio">`, visually hidden underneath a custom ring-and-dot indicator. Like Checkbox, it deliberately skips React Aria/Radix roving-tabindex code — the browser already roves focus between same-`name` radios for free. Use it for single-choice selection within a named group, typically composed inside `Fieldset` for group semantics.

## Do
- Give every Radio in a group the same `name` — that's what makes the browser treat them as one mutually-exclusive group, controlled (`checked` + `onChange` per input) or uncontrolled (`defaultChecked` per input).
- Compose Radio groups inside `Fieldset` to get `<fieldset>`/`<legend>` semantics for the group's accessible name — Radio itself does not provide group-level wrapper state.
- Treat the ring/dot as a shape cue, not a color cue — the dot only appears when checked, satisfying the non-color-cue requirement.

## Don't
- Don't unit-test or assume arrow-key roving focus is verified by the test suite — see the Accessibility note below.
- Don't expect Radio to render a fieldset/legend itself — pair it with `Fieldset` for the group's accessible name.
- Don't rely on the brand accent color for the checked dot — it uses `role.neutral.solid`, the same accent-scarcity reasoning as Checkbox/Switch.

## Accessibility
- **Keyboard:** Tab moves focus onto/off the radio group (verified in `Radio.test.tsx`). Arrow-key roving focus (ArrowUp/Down/Left/Right moving selection between same-`name` radios) is native browser behavior, not code this component implements. The source explicitly documents that jsdom — used by the Vitest suite — does not fully implement native radio-group arrow-key roving focus, so **this is not covered by an automated test**; it must be manually verified in a real browser session before relying on it. Treat it as expected-to-work-natively, not "tested."
- **Screen reader:** The native input carries the real `checked`/`disabled` state and receives focus, so screen readers announce role/state exactly as a normal radio button. The custom ring is `aria-hidden` and purely decorative.
- **Focus:** Focus-visible renders as an outline ring around the custom ring element, not a shadow. The wrapper (`label`) has a 40px `min-inline-size`/`min-block-size` hit area (`size.control.sm`) while the visible ring stays visually smaller (`size.icon.lg`) and centered via flex — same pattern as Checkbox/Switch.

## Props
| Prop | Type | Default | Description |
|---|---|---|---|
| ...rest | `ComponentPropsWithoutRef<'input'>` (minus `type`, `size`) | — | Native radio props (`name`, `value`, `checked`, `defaultChecked`, `onChange`, `disabled`, `aria-label`, etc.) pass straight through — `RadioProps` has no bespoke props of its own. |

## Related
- `Fieldset` — provides the `<legend>`/group semantics a set of Radios needs; Radio itself has no group wrapper.
- `Checkbox` and `Switch` — sibling selection controls sharing the same visually-hidden-input, shape-cue, and 40px hit-area conventions.
