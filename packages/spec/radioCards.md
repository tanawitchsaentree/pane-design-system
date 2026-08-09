# RadioCards

## Usage
RadioCards is a "choose 1 of N" control where the whole card — not just a small dot — is the click target (e.g. picking a plan/tier). It's backed by nothing but a native `<input type="radio">` group sharing one `name`, exactly the same primitive `Radio` uses, just with a much bigger, fully-clickable visual on top. Declare cards as `RadioCards.Item` children of a `RadioCards` root.

## Do
- Give `RadioCards` a `name` — it's the entire mechanism that groups every `RadioCards.Item`'s underlying radio input for the browser's native roving focus/Arrow-key cycling.
- Use `value`/`onChange` for controlled usage, `defaultValue` for uncontrolled — both are plain strings, matching every other Standalone control in the system.
- Write any content you like inside `RadioCards.Item` (title, description, icon) — every bit of text becomes that card's accessible name for free via the native label-wraps-input algorithm. No extra `aria-label` needed on the item.
- Pass `aria-label`/`aria-labelledby` on the `RadioCards` root — a radio group needs its own accessible name (dev-time console warning fires if you forget, mirroring `Listbox`'s own check).
- Disable a single card via `RadioCards.Item`'s own `disabled`, or the whole group via the root's `disabled` — both compose (a card disabled at the group level stays disabled even if its own `disabled` is `false`).

## Don't
- Don't expect arrow-key cycling or roving tabindex to be covered by `RadioCards.test.tsx` (jsdom) — it's native browser behavior, proven only in `packages/conformance/specs/w5-radiocards.spec.ts` (real browser). See the Accessibility note.
- Don't reach for `selectedKeys`/`onSelectionChange` — that vocabulary belongs to the Collection family (Listbox/Select/Combobox/MultiSelect/Menu/ContextMenu). RadioCards has one value, not a keyed collection, so it uses `value`/`onChange` instead (D-024).
- Don't forward arbitrary boolean-looking props through `...rest` expecting them to reach the DOM cleanly — `required`/`invalid` are consumed explicitly and mapped to `aria-required`/`aria-invalid` on the `radiogroup`, because blindly spreading them (as an earlier draft did) leaks a non-standard DOM attribute and triggers a React warning when `FormField` clones them in.

## Accessibility
- **Keyboard:** Tab moves focus onto/off the whole group (the browser lands on the checked card, or the first card if none is checked yet — native radio-group behavior). Arrow keys cycle selection between cards sharing the group's `name`; this and the resulting roving tabindex are 100% native browser behavior, not code this component implements — same honest limit `Radio.tsx` documents. **Not covered by an automated jsdom test**; verified in a real browser via `packages/conformance/specs/w5-radiocards.spec.ts`, which asserts `document.activeElement`/`.checked` directly rather than importing `_roving-focus.ts`'s helpers (those were written against React Aria's `useSelectableCollection`, which sets a `tabindex` DOM attribute per item — native radio groups never do, so pointing those helpers at RadioCards would silently pass without proving anything).
- **Screen reader:** each card's accessible name comes from its own content via the native label-wraps-input algorithm — a card with a title and description needs no extra wiring. The group itself needs its own `aria-label`/`aria-labelledby` (see Do).
- **Non-color cue:** the selected card's border thickens (not just changes color) and a checkmark glyph appears in the corner indicator — two independent non-color signals, so selection state survives forced-colors mode where the border/background color tokens collapse.
- **Focus:** the whole card (the `label` wrapping the hidden input) is the hit area and carries the focus ring, not just the small corner indicator — verified ≥40px in `w5-radiocards.spec.ts` (cards are typically larger than this floor already, but the floor is enforced, not assumed).

## Props
### `RadioCards`
| Prop | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | — (required) | Groups every child `RadioCards.Item`'s radio input. |
| `value` | `string` | — | Controlled selected value. |
| `defaultValue` | `string` | — | Initial selected value for uncontrolled usage. |
| `onChange` | `(value: string) => void` | — | Fires with the newly-selected card's value. |
| `disabled` | `boolean` | `false` | Disables every card in the group at once. |
| `required` | `boolean` | `false` | Sets `aria-required` on the `radiogroup`. |
| `invalid` | `boolean` | `false` | Sets `aria-invalid` on the `radiogroup`. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction of the cards. |

### `RadioCards.Item`
| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | — (required) | This card's value. |
| `disabled` | `boolean` | `false` | Disables just this card (OR'd with the group's `disabled`). |
| `children` | `ReactNode` | — | Card content — becomes the radio's accessible name. |

## Related
- `Radio` — the underlying native-input technique RadioCards extends with a bigger, fully-clickable visual; no new behavior, only a new visual layer.
- `Fieldset` — provides `<legend>`/group semantics for a plain `Radio` group; RadioCards doesn't use it because its visual is a row/column of standalone cards, not a bordered fieldset box — its accessible name comes from the root's own `aria-label`/`aria-labelledby` instead.
- `Listbox` — the Collection-family analog for "choose 1 (or more) from a list," but built on a different engine (React Aria) and a different prop vocabulary (`selectedKeys`) because it models a keyed collection, not a single value.
