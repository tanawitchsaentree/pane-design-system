# Listbox

## Usage
Listbox renders an ARIA `listbox` (`role="listbox"` + `role="option"` children) with real keyboard navigation, typeahead, and roving tabindex — all borrowed from React Aria (`@react-stately/list`'s `useListState` + `@react-aria/listbox`'s `useListBox`/`useOption`), not hand-written. It is the template component for Wave 5 (Selection): Select, Combobox, MultiSelect, RadioCards, and TagInput all reuse this same collection/behavior pattern. Declare options as `Listbox.Item` children (React Aria's Collection API — these render nothing themselves; `useListState` walks them to build the actual option collection).

## Do
- Always pass `aria-label` (or `aria-labelledby`) — Listbox never assumes an adjacent visible `<label>` the way a native `<select>` sometimes inherits one.
- Use `selectedKeys`/`onSelectionChange` for controlled usage, `defaultSelectedKeys` for uncontrolled — same duality every other input in this system follows.
- Give every `Listbox.Item` a stable `key` — it's how selection, disabling, and typeahead all identify options.
- Set `selectionMode="multiple"` for multi-select — the checkmark non-color cue and `aria-selected` sync both work the same way in either mode.

## Don't
- Don't write your own keyboard handler, focus index, or typeahead buffer on top of this component — everything in the Roving Focus contract (arrow keys, Home/End, typeahead, scroll-into-view) comes from React Aria already.
- Don't assume Arrow Down wraps from the last option back to the first — it doesn't, by design (see Accessibility note).
- Don't rely on the selected-option background alone to communicate selection — the checkmark glyph's presence/absence is the real non-color cue; the background tint is reinforcement only.

## Accessibility
- **Keyboard:** Arrow Up/Down move the active option and do **not** wrap (React Aria's `useSelectableCollection` defaults `shouldFocusWrap` to `false` — verified by reading the actually-resolved `@react-aria/selection` source in this repo's lockfile, not just the docs). Home/End jump to the first/last option. Typing a character jumps to the next option whose label starts with it (React Aria's built-in typeahead). Before any option has ever been focused, the listbox root itself is `tabindex="0"` and every option is `tabindex="-1"` (ARIA Authoring Practices' documented roving-tabindex bootstrap state); the moment an option is focused, tabindex moves onto it and stays there.
- **Scroll-into-view:** when the root has a fixed `max-block-size` and overflows, focusing an off-screen option scrolls it into view automatically — but only when the focus change's *modality* is `'keyboard'` (confirmed by direct testing: a raw `element.focus()` call does not scroll; pressing an actual arrow/Home/End key does).
- **Screen reader:** each option carries `role="option"` + `aria-selected` synced to real selection state (not a CSS class); the root carries `aria-multiselectable="true"` automatically when `selectionMode="multiple"`.
- **Focus:** focus-visible renders as an inset outline ring on the option itself, not a shadow. Each option's hit area is `size.control.sm` (40px, D-002 web-first minimum) via `min-block-size`, regardless of how little text it contains.
- Real-browser-only behavior (Arrow-key roving tabindex, Home/End, typeahead, scroll-into-view — none of which jsdom can prove) is verified in `packages/conformance/specs/w5-listbox.spec.ts` across chromium/forced-colors/reduced-motion, not in `Listbox.test.tsx`.

## Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `selectionMode` | `'single' \| 'multiple'` | `'single'` | Mirrors ARIA listbox's `aria-multiselectable`. |
| `selectedKeys` | `'all' \| Iterable<Key>` | — | Controlled selected keys. |
| `defaultSelectedKeys` | `'all' \| Iterable<Key>` | — | Initial selected keys for uncontrolled usage. |
| `onSelectionChange` | `(keys: Selection) => void` | — | Fires whenever selection changes. |
| `disabledKeys` | `Iterable<Key>` | — | Keys of options that cannot be focused, selected, or interacted with. |
| `aria-label` | `string` | — (**required**) | Accessible name for the listbox root. |
| `aria-labelledby` | `string` | — | Alternative to `aria-label`, referencing an external label element. |
| `children` | `Listbox.Item` elements | — (required) | The option collection (React Aria Collection API). |

## Related
- `Popover` — the W5 sibling `Select` will place a `Listbox` inside a `Popover.Content` to build a dropdown; `Listbox` itself has no floating-panel behavior.
- `Radio`/`Checkbox`/`Switch` — other selection controls in the system, but single native-input controls with browser-native roving focus, not a multi-item collection with programmatic behavior like Listbox.
