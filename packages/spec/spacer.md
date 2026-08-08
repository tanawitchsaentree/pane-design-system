# Spacer

## Usage
Spacer is a purely presentational spacing utility extending Box (D-012) — it never carries content. With no `size` set it grows to fill available space (`flex: 1`) inside a flex container, useful for pushing siblings apart; with a `size` set (a `SpaceToken`) it acts as a fixed-size gap.

## Do
- Use an unsized Spacer inside a Flex/Stack row to push one group of children to the start and another to the end (e.g. left label / right action).
- Use a sized Spacer (`size="400"`, etc.) when you need a fixed gap that isn't naturally expressed by the parent's `gap` prop.
- Treat Spacer as childless — it's not meant to wrap content.

## Don't
- Don't put children inside Spacer — it's designed to be empty and is marked `aria-hidden`.
- Don't use Spacer as a substitute for a Flex/Stack `gap` prop when a uniform gap between all children would do — reserve it for one-off pushes/gaps.
- Don't expect Spacer to grow inside a non-flex parent — its `flex: 1` growth behavior only applies within a flex layout.

## Accessibility
- **Keyboard:** N/A — non-interactive layout primitive.
- **Screen reader:** Explicitly hidden via `aria-hidden="true"` — screen readers skip it entirely, the same way they'd skip empty whitespace.
- **Focus:** Not focusable; carries no content and no interactive semantics.

## Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `SpaceToken` | `undefined` | Fixed size referencing a `space.*` token. Omit to grow and fill available space (`flex: 1`). |
| ...BoxProps (minus `children`) | — | — | Inherits Box props except `children`, which is intentionally excluded — Spacer never carries content. |

## Related
- Flex, Stack (Spacer is used inside these to push apart flex children), Box (base primitive).
