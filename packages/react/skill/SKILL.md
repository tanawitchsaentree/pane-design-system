---
name: pane
description: Build product UI with Pane (pane-react), the spatial glass design system. Use whenever a React screen, form, table, dialog or chart is built or changed in a project that depends on pane-react, or when the user asks for Pane, glass UI or "use the design system". It says which component fits which job, the rules the system enforces, and the states each part must handle, so the right pattern shows up the first time.
---

# Building with Pane

Pane is a design system of clear, blurred glass panes over a scene. The scene is part of the interface, so a screen is built in three layers. The `Environment` says how bright the scene can get, panes (`Card`, `Sheet`, `Dialog`) carry the content, and components sit on those panes. Words never sit straight on a photo.

Before writing a screen, look things up instead of guessing. The package ships an MCP server (`npx pane-mcp`) with `list_components`, `search_components`, `get_component` (props, keys, states, tokens) and `search_tokens`, and the docs publish `https://pane-design-system.pages.dev/llms.txt`.

## Set up once

```tsx
import 'pane-react/tokens.css';            // or tokens/core.css + tokens/colour.css
import { Environment, PaneProvider, th } from 'pane-react';

<PaneProvider locale="th-TH" messages={th}>  {/* only for a Thai product */}
  <Environment brightness="bright">{app}</Environment>
</PaneProvider>
```

Import components by subpath (`import { Button } from 'pane-react/Button'`) when the bundle matters; each brings its own CSS and tokens. A white-label product also loads `pane-react/tokens/brands/<id>.css` and sets `data-brand` on the root.

## Rules the system enforces

1. One loud action per pane. `Button` (light) is that action; others are `glass` or `ghost`. Two light buttons side by side is a bug.
2. Status is a glyph and a word, never a colour alone. Use `Badge`, `Banner`, `HelperText` and `Toast` tones; do not colour text red or green by hand.
3. No raw values. Colours, sizes, radii and durations come from tokens (`var(--ds-…)`); the lint fails a hex or a px in component CSS.
4. Text sits on glass. Put content in a `Card` (or another pane). A `Table`, `List` or `Listbox` straight on a scene brings its own glass, but loose paragraphs do not.
5. Every control has a name a screen reader can say. A field lives in a `FormField` with a `label`; an icon-only button needs `aria-label`. Give the id to `FormField`, not to the `Input` inside it.
6. Touch targets are 44px. Do not shrink a control below its size prop; `sm` is the declared dense exception.
7. Hue belongs to content. Charts use the data palette (`--ds-viz-series-*`), ordered levels use the sequential ramp (`ConfidenceChip`, `Heatmap`), and nothing else picks a hue.

## Which component for which job

| The job | Use | Not |
|---|---|---|
| The main action of a pane | `Button` | a styled `<a>` (use `Button href`) |
| A toggle such as Bold | `Button pressed` or `IconButton pressed` | a `Switch` |
| An action with rarer alternatives | `SplitButton` | two buttons |
| Buttons that belong together | `ButtonGroup` (`attached` for tools) | a hand-made flex row |
| A setting that applies at once | `Switch` | a `Checkbox` |
| One choice from 2–5 views | `SegmentedControl` | `Tabs` with no panels |
| One value from a long list | `Select`, or `Combobox` to type | a native `<select>` |
| Several values | `MultiSelect`, `Listbox` | many Checkboxes in a long list |
| A field with a limit | `Input` or `Textarea` with `maxLength` and `showCount` | a counter by hand |
| A chat or comment box | `Textarea autoResize` | a fixed-height textarea |
| Rows to compare | `Table`, or `DataGrid` to sort and select | a grid of `div`s |
| A long feed | `Feed` or `VirtualList` | rendering every row |
| A short message about what just happened | `Toast`, `Snackbar` on a phone | `alert()` |
| A message about the pane | `Banner` | a coloured box |
| A task over the screen | `Dialog`, `Sheet` from an edge, `ActionSheet` for a short list | a positioned div |
| How sure a claim is | `ConfidenceChip` | a traffic-light colour |
| Steps on a canvas | `NodeCard`, `NetworkGraph`, `SequenceDiagram` | an image |

## States every part must handle

Each family has rows on the docs' state matrix (`/patterns/states`); a screen must cover the same ones:

- **Fields:** default, focused, filled, invalid (with the reason in `error`), warning, disabled, read only, required.
- **Actions:** default, hover, pressed, focus, disabled, loading (keeps its width).
- **Data:** loading, empty (`EmptyState` with the way out), error with a retry, one row, many rows, a long value.
- **Overlays:** open, closed, with a long title, on a phone width.

## Before calling a screen done

- It reads on a photo scene and on a plain dark one, in dark and light themes.
- Keyboard alone reaches and uses everything, and focus is visible.
- Thai text with stacked marks (เหี่ยะ) is not clipped in any field.
- A 375px width shows no horizontal scroll outside a table or code.
- No hex, px or hand-picked colour was added outside tokens.
