# InputGroup

## Usage
InputGroup composes a control (typically an `Input` or a raw `<input>`) with prefix/suffix adornments into one visually unified bordered group, built on `Flex` from the layout wave. It's the right choice when the adornment is a multi-character block that should read as its own contiguous segment (e.g. "$" + amount + "USD") — as opposed to `Input`'s own `leftElement`/`rightElement`, which are small in-box icon glyphs sharing the same bordered box as the text.

## Do
- Use InputGroup's `prefix`/`suffix` for currency symbols, unit labels, or other multi-character adornments that should visually read as a distinct segment next to the control.
- Let the inner control keep its own focus ring — InputGroup is a layout/visual wrapper and does not intercept focus.
- Pair a meaningful prefix/suffix with a `Label`/`HelperText` (ideally via `FormField`) rather than relying on the adornment text alone to convey meaning, since adornments are `aria-hidden`.

## Don't
- Don't use InputGroup for a single small icon glyph inside the same box as the text — use `Input`'s `leftElement`/`rightElement` instead.
- Don't expect the prefix/suffix to be announced to screen readers — they're `aria-hidden` by design, purely decorative.
- Don't pass `direction`, `gap`, `align`, or `prefix`-as-a-`FlexProps`-collision — InputGroup's underlying `Flex` is locked to `direction="row"`/`align="stretch"` and these are omitted from its prop type.

## Accessibility
- **Keyboard:** None of its own — keyboard behavior belongs entirely to the composed control (e.g. the native `<input>` inside it).
- **Screen reader:** InputGroup introduces no new role — it's purely a layout/visual composition. Both `prefix` and `suffix` are rendered with `aria-hidden="true"` (verified in `InputGroup.test.tsx`), so any adornment that conveys real meaning needs its own accessible pairing via `Label`/`HelperText`, not the adornment text alone.
- **Focus:** Focus passes straight through to the inner control; the group wrapper itself is not a focus target and does not add a focus ring of its own.

## Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `prefix` | `ReactNode` | — | Prefix adornment rendered before the input (e.g. a currency symbol). Decorative. |
| `suffix` | `ReactNode` | — | Suffix adornment rendered after the input (e.g. a unit label). Decorative. |
| `children` | `ReactNode` | — | The wrapped control. |
| ...rest | `Omit<FlexProps, 'direction' \| 'gap' \| 'align' \| 'prefix'>` | — | All other `Flex` props pass through except the ones InputGroup locks internally. |

## Related
- `Input` — the typical control composed inside InputGroup; use Input's own `leftElement`/`rightElement` instead for small in-box icon adornments.
- `Flex` — the layout primitive InputGroup is built on (Reuse Check: no bespoke flexbox implementation).
- `FormField` — pairs a Label/HelperText around an InputGroup's control when the prefix/suffix conveys meaning that needs an accessible equivalent.
