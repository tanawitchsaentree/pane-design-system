# Link

## Usage
Link wraps a native `<a>` for navigation — inline body-copy links, nav items, or any anchor to another page/section. It defaults to a quiet, non-underlined style at rest (D-001: calm, underline appears on hover/focus) and automatically adds `target="_blank" rel="noopener noreferrer"` to absolute cross-origin `href`s so callers don't have to remember the security attributes.

## Do
- Leave `variant='subtle'` (the default) for most inline body-copy links; it's the calm, non-accent treatment.
- Reserve `variant='default'` for the rare link that IS a view's primary action, since it spends the scarce brand accent (D-001).
- Use `asChild` when a framework router's own `<Link>` component needs to own the anchor element.

## Don't
- Don't override `target`/`rel` on cross-origin links unless you have a specific reason — the automatic `noopener noreferrer` behavior exists for security by default.
- Don't use `variant='default'` on every link on a page — that defeats the accent-scarcity intent.

## Accessibility
- **Keyboard:** Native `<a>` semantics — `Tab`/`Shift+Tab` to move focus, `Enter` to activate.
- **Screen reader:** Renders a real `<a href>` with its own text content as the accessible name; `target`/`rel` are set correctly for cross-origin links so assistive tech and browsers handle the new-tab behavior predictably.
- **Focus:** `:focus-visible` always shows the dedicated focus-ring token (color/width/offset) — underline is a style choice that only appears on hover/focus, but focus visibility itself is never negotiable per the component's own doc comment.

## Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `href` | `string` | — (required) | The link destination. |
| `variant` | `'default' \| 'subtle'` | `'subtle'` | `'default'` spends the scarce brand accent (D-001); `'subtle'` is plain text color for most inline links. |
| `asChild` | `boolean` | `false` | Renders as the single child element instead of `a` (e.g. for a router's own Link component). |
| `children` | `ReactNode` | — | Link content. |

## Related
- Button with `asChild` — for a link that should look like a button rather than inline text.
- Text — Link commonly sits inline within Text body copy.
