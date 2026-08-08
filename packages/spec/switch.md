# Switch

## Usage
Switch renders a native `<input type="checkbox" role="switch">` visually hidden underneath a custom track-and-thumb control. It reuses Checkbox's visually-hidden-input technique so it keeps native Tab/Space keyboard behavior for free, but announces to assistive tech as a switch (on/off) rather than a checkbox. Use it for immediate-effect binary settings (e.g. "Dark mode", "Notifications") rather than choices that need explicit form submission.

## Do
- Use Switch specifically when the on/off toggle takes effect immediately (a settings-style toggle) — that's the semantic difference `role="switch"` communicates over a checkbox.
- Rely on the thumb's physical position as the primary on/off cue — it slides via `inset-inline-start`, a real non-color state change, not just a track color swap.
- Let it work controlled (`checked` + `onChange`) or uncontrolled (`defaultChecked`) exactly like a checkbox.

## Don't
- Don't try to override `role` — it's hard-set to `"switch"` in the component and cannot be passed as a prop (it's this component's entire reason to exist over a plain Checkbox).
- Don't use Switch for a value that requires explicit form submission before taking effect — reach for `Checkbox` instead.
- Don't assume the on-state track uses the brand accent — it uses `role.neutral.solid`, per the same accent-scarcity rule as Checkbox/Radio.

## Accessibility
- **Keyboard:** Tab to focus, Space to toggle — native `<input type="checkbox">` behavior underneath `role="switch"`, verified in `Switch.test.tsx` (tab, then `Space` toggles `checked`).
- **Screen reader:** The native input carries the real `checked`/`disabled` state and receives focus; `role="switch"` makes assistive tech announce it as "on"/"off" rather than "checked"/"unchecked". The custom track/thumb visual is `aria-hidden`.
- **Focus:** Focus-visible renders as an outline ring around the track, not a shadow. The wrapper (`label`) has a 40px hit area (`min-inline-size`/`min-block-size: size.control.sm`) while the visible track (`size.avatar.lg` = 48px wide × `size.icon.lg` tall) stays visually distinct and centered. The track was specifically sized so its 20px thumb (`size.icon.md`) has a real ~24px travel distance between off and on — previously the track matched the thumb+offset almost exactly, giving effectively 0px of visible movement.

## Props
| Prop | Type | Default | Description |
|---|---|---|---|
| ...rest | `ComponentPropsWithoutRef<'input'>` (minus `type`, `size`, `role`) | — | Native checkbox props (`checked`, `defaultChecked`, `onChange`, `disabled`, `aria-label`, etc.) pass straight through — `SwitchProps` has no bespoke props of its own. |

## Related
- `Checkbox` — the underlying native-input pattern Switch borrows (visually-hidden input + custom visual), differing only in `role` and the track/thumb visual.
- `Radio` — sibling selection control sharing the same 40px hit-area and shape-cue conventions.
