# Popover

## Usage
Popover is a lightweight, trigger-anchored floating panel for auxiliary content — menus, filter panels, inline forms, or extra detail that doesn't need to block the page. Unlike Dialog, it is non-modal by default: focus stays on the trigger, and the panel dismisses on click-outside or Escape without trapping focus or inerting the background. It renders through a portal at `z-index: var(--ds-z-index-popover)` (1500) with `shadow.elevation.md`, positioned relative to its trigger.

## Do
- Use the default non-modal behavior for the common case (menus, filters, quick actions); only set `modal={true}` for the rare popover that must behave like a mini-modal.
- Use `Popover.Anchor` when the visual anchor point needs to differ from the element that actually opens the popover.
- Pair with `Popover.Arrow` when a visual pointer back to the trigger helps orient the user.

## Don't
- Don't use Popover for content that must block user interaction with the rest of the page — that's Dialog's job.
- Don't use Popover for a simple one-line text hint — that's Tooltip's job (Popover is heavier and click/focus-triggered, not hover-triggered).
- Don't hand-roll click-outside or Escape dismissal — both are wired by `@radix-ui/react-popover`, not custom code.

## Accessibility
- **Keyboard:** Escape closes the popover; focus is not trapped inside it by default (non-modal), so Tab continues through the surrounding page unless `modal={true}` is set.
- **Screen reader:** Radix renders the content with `role="dialog"`. Verified axe-clean when open in `Popover.test.tsx`.
- **Focus:** Focus remains on the trigger by default when the popover opens (non-modal); click-outside and Escape both close it (confirmed in tests).

## Props

`Popover.Root` (`PopoverRootProps`):

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | — | Controlled open state. |
| `defaultOpen` | `boolean` | `false` | Initial open state for uncontrolled usage. |
| `onOpenChange` | `(open: boolean) => void` | — | Fires whenever open state changes (click-outside/Escape, or programmatic). |
| `modal` | `boolean` | `false` | Renders `Popover.Content` in a focus-trapping modal layer when `true`; default is a lightweight non-blocking panel. |
| `children` | `ReactNode` | — | `Popover.Trigger` + `Popover.Content`. |

`Popover.Content` (`PopoverContentProps`, extends `Omit<ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>, 'side'>`):

| Prop | Type | Default | Description |
|---|---|---|---|
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | Preferred edge to render against the trigger. |
| `sideOffset` | `number` | `8` | Gap between trigger and panel. |
| `portal` | `boolean` | `true` | Renders in a `document.body` portal unless the caller supplies their own `PopoverPrimitive.Portal`. |

Other exports: `Popover.Trigger`, `Popover.Anchor` (optional positioning reference distinct from the trigger), `Popover.Close`, `Popover.Arrow` — thin forwardRef wrappers around the corresponding Radix Popover primitives.

## Related
- Tooltip — for a plain hover/focus text hint instead of an interactive panel.
- Dialog — for content that must block the page and trap focus.
- Drawer — for edge-anchored panels rather than trigger-anchored floating ones.
