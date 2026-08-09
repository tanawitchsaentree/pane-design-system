# Listbox

## Usage
Listbox renders an ARIA `listbox` (`role="listbox"` + `role="option"` children) with real keyboard navigation, typeahead, and roving tabindex — all borrowed from React Aria (`@react-stately/list`'s `useListState` + `@react-aria/listbox`'s `useListBox`/`useOption`/`useListBoxSection`), not hand-written. It is the template component for Wave 5 (Selection): Select, Combobox, MultiSelect, RadioCards, and TagInput all reuse this same collection/behavior pattern and its `selectedKeys`/`defaultSelectedKeys`/`onSelectionChange`/`disabledKeys` vocabulary (D-024's API Vocabulary Contract). Declare options as `Listbox.Item` children and, optionally, group them under `Listbox.Section` (React Aria's Collection API — these render nothing themselves; `useListState` walks them to build the actual option collection).

## Do
- Pass `aria-label` (or `aria-labelledby`) only when this Listbox is used **standalone** (outside `FormField`) — a listbox with no accessible name at all is a real a11y bug. When nested inside `FormField`, omit both: `FormField` wires `aria-labelledby` automatically (see Accessibility note).
- Use `selectedKeys`/`onSelectionChange` for controlled usage, `defaultSelectedKeys` for uncontrolled — same duality every other input in this system follows. Both are always a plain `ReadonlySet<Key>` — never branch on the string `'all'`; this component normalizes React Aria's own `Selection` type (which can be `'all'`, e.g. after `Mod+A`) before either prop crosses the boundary.
- Give every `Listbox.Item` a stable `key` — it's how selection, disabling, and typeahead all identify options.
- Disable an option only via the parent's `disabledKeys` — there is no per-`Listbox.Item` `isDisabled` prop. Disabled state lives in one data-driven place, not scattered across JSX call sites (D-024 review item 5).
- Set `selectionMode="multiple"` for multi-select — the checkmark non-color cue, `aria-selected` sync, and `Mod+A` select-all all work the same way in either mode.
- Group related options with `Listbox.Section` (e.g. "Recent" / "All countries") when the list has a natural grouping — every W5 sibling that needs sections (Select, Combobox) reuses this exact shape rather than inventing its own.

## Don't
- Don't write your own keyboard handler, focus index, or typeahead buffer on top of this component — everything in the Roving Focus contract (arrow keys, Home/End, typeahead, scroll-into-view, Tab-out) comes from React Aria already.
- Don't assume Arrow Down wraps from the last option back to the first — it doesn't, by design (see Accessibility note).
- Don't rely on the selected-option background alone to communicate selection — the checkmark glyph's presence/absence is the real non-color cue; the background tint is reinforcement only.
- Don't pass `aria-label` to a Listbox nested inside `FormField` — it would give the option list two competing accessible names (see Accessibility note).

## Accessibility
- **Keyboard:** Arrow Up/Down move the active option and do **not** wrap (React Aria's `useSelectableCollection` defaults `shouldFocusWrap` to `false` — verified by reading the actually-resolved `@react-aria/selection` source in this repo's lockfile, not just the docs). Home/End jump to the first/last option. Typing a character jumps to the next option whose label starts with it (React Aria's built-in typeahead). `Mod+A` (Cmd/Ctrl+A) selects every option when `selectionMode="multiple"` (confirmed firing in a real browser). Before any option has ever been focused, the listbox root itself is `tabindex="0"` and every option is `tabindex="-1"` (ARIA Authoring Practices' documented roving-tabindex bootstrap state); the moment an option is focused, tabindex moves onto it and stays there. Tab/Shift+Tab move focus out of the whole widget in one step and — proven via a round-trip assertion after a real compound-invariant investigation, not assumed — correctly remember which option was last active when focus returns.
- **Scroll-into-view:** when the root has a fixed `max-block-size` and overflows, focusing an off-screen option scrolls it into view automatically — but only when the focus change's *modality* is `'keyboard'` (confirmed by direct testing: a raw `element.focus()` call does not scroll; pressing an actual arrow/Home/End key does).
- **Screen reader:** each option carries `role="option"` + `aria-selected` synced to real selection state (not a CSS class); the root carries `aria-multiselectable="true"` automatically when `selectionMode="multiple"`. A `Listbox.Section` renders as `role="presentation"` (ARIA disallows a heading as a direct listbox child) wrapping a hidden heading and a `role="group"` with `aria-labelledby` pointing at that heading — the heading is a *visual* label only; the group's actual accessible name comes through `aria-labelledby`.
- **FormField integration:** a Listbox nested directly inside `FormField` needs neither `aria-label` nor `aria-labelledby` — `FormField` clones its child with `aria-labelledby` pointing at its own generated label id (the same wiring `Input`/`Textarea`/`Checkbox` get via `htmlFor`/`id`, extended because `<ul role=listbox>` is not a labelable HTML element and gets no accessible name from `htmlFor` alone). Verified in `packages/conformance/specs/w5-listbox.spec.ts`'s `FormField integration` test that the accessible name resolves exactly once, not twice.
- **Focus:** focus-visible renders as an inset outline ring on the option itself, not a shadow. Each option's hit area is `size.control.sm` (40px, D-002 web-first minimum) via `min-block-size`, regardless of how little text it contains.
- Real-browser-only behavior (Arrow-key roving tabindex, Home/End, typeahead, scroll-into-view, Tab-out round-trip — none of which jsdom can prove) is verified in `packages/conformance/specs/w5-listbox.spec.ts` across chromium/forced-colors/reduced-motion, not in `Listbox.test.tsx`.

## Performance ceiling (no virtualization)
Listbox — and, by inheritance, every W5 sibling that reuses this collection pattern (Select, Combobox, MultiSelect) — renders every `Listbox.Item`/`Listbox.Section` child as a real DOM node. There is no windowing/virtualization render-prop. This system specs Select/Combobox to stay comfortable up to roughly **300-500 options**, the point where unvirtualized list benchmarks commonly start showing scroll-jank on mid-range hardware. Past that ceiling, a future virtualized variant needs its own component — not a silently-added prop on this one. Cite this ceiling directly rather than re-deriving it when writing Select/Combobox's own specs.

## Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `selectionMode` | `'single' \| 'multiple'` | `'single'` | Mirrors ARIA listbox's `aria-multiselectable`. |
| `selectedKeys` | `ReadonlySet<Key>` | — | Controlled selected keys (D-024 Collection Vocabulary). |
| `defaultSelectedKeys` | `ReadonlySet<Key>` | — | Initial selected keys for uncontrolled usage. |
| `onSelectionChange` | `(keys: ReadonlySet<Key>) => void` | — | Fires whenever selection changes. Always a real `Set`, never the string `'all'`. |
| `disabledKeys` | `Iterable<Key>` | — | Keys of options that cannot be focused, selected, or interacted with — the only way to disable an option. |
| `aria-label` | `string` | — | Accessible name for the listbox root. Required only when used standalone (outside `FormField`). |
| `aria-labelledby` | `string` | — | Alternative to `aria-label`. Omit both when nested inside `FormField`. |
| `children` | `Listbox.Item`/`Listbox.Section` elements | — (required) | The option collection (React Aria Collection API). |

## Related
- `FormField` — wires `aria-labelledby` automatically when a Listbox is its child; see Accessibility note above.
- `Popover` — the W5 sibling `Select` will place a `Listbox` inside a `Popover.Content` to build a dropdown; `Listbox` itself has no floating-panel behavior.
- `Radio`/`Checkbox`/`Switch` — other selection controls in the system, but single native-input controls with browser-native roving focus, not a multi-item collection with programmatic behavior like Listbox. These use the Standalone Control vocabulary (`checked`/`onChange`), not Listbox's Collection vocabulary (D-024).
