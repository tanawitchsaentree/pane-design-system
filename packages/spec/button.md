# Button

## Usage
Button is the native `<button>`-based interactive control for triggering actions — form submits, dialog opens, any click-driven action. It supports four fill treatments (`solid`/`outline`/`ghost`/`link`), three intents (with `primary` reserved for the single most important action per view per D-001 accent scarcity), a loading state that shows a spinner and marks the control busy, and optional leading/trailing icon slots.

## Do
- Default to `intent='neutral'` for most buttons; reserve `intent='primary'` for the one most important action in a given view.
- Use `loading` for async actions so the control is disabled and announced as busy (`aria-busy`) while work is pending.
- Use `asChild` when the button must actually render as an `<a>` (e.g. a styled navigation link) instead of a real `<button>`.

## Don't
- Don't use `intent='primary'` on more than one button per view — it spends a scarce accent per D-001.
- Don't rely on `disabled` alone to communicate a pending async action — use `loading` so assistive tech gets `aria-busy`.
- Don't put two icons and no visible label on Button for an icon-only control — use IconButton instead, which enforces a required `aria-label`.

## Accessibility
- **Keyboard:** Native `<button>` semantics — `Tab`/`Shift+Tab` to move focus, `Enter` or `Space` to activate. Disabled (including while `loading`) removes it from the tab order via the native `disabled` attribute.
- **Screen reader:** While `loading`, the button is `disabled` and `aria-busy="true"`, and the visible Spinner exposes `role="status"` so the pending state is announced. Icon slots (`leftIcon`/`rightIcon`) are wrapped with `aria-hidden="true"` since the visible label is the accessible name.
- **Focus:** `:focus-visible` uses the dedicated focus-ring token (color/width/offset) — never a shadow ring, per braun-flat rule 4. Outline variant's border color uses `color.border.interactive` (D-014) to meet the 3:1 UI-boundary contrast minimum.

## Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'solid' \| 'outline' \| 'ghost' \| 'link'` | `'solid'` | Fill treatment. |
| `intent` | `ActionIntent` | `'neutral'` | Visual intent; `'primary'` reserved for the single most important action per view (D-001). |
| `size` | `ControlSizeToken` | `'md'` | `size.control.*` t-shirt scale (D-004, md=48). |
| `loading` | `boolean` | `false` | Shows a spinner in the icon slot and marks the button busy/disabled. |
| `leftIcon` | `ReactNode` | `undefined` | Icon rendered before the label. |
| `rightIcon` | `ReactNode` | `undefined` | Icon rendered after the label. |
| `asChild` | `boolean` | `false` | Renders as the single child element instead of `button` (e.g. an anchor styled as a button). |
| `children` | `ReactNode` | — | Button label content. |

## Form goal
Control class (`system/FORM.md`, D-030): raised at rest via `shadow.raised.sm` — a single directional shadow measured from the real Braun reference, not a decorative shadow and not a neumorphic dual-tone gradient — flipping to `shadow.inset.sm` when pressed/active, the shadow direction swapping rather than just deepening. `link`/`ghost` variants stay flat (they read as text, not as an extruded key). D-031 (Foundry pick, Niche B) locks this as Dial's shipped treatment.

## Related
- IconButton — the icon-only variant of Button, extending its variant/intent/size/loading API 1:1.
- Link — the non-button interactive text element; use when the action is navigation styled as inline text rather than a control.
- Spinner — rendered inside Button automatically when `loading` is true.
