# Tooltip

## Usage
Tooltip is a small, text-only hint bubble attached to a trigger element, typically shown on hover or keyboard focus. Per D-002 ("web-first"), hover is treated as a first-class trigger here rather than adapted away for touch — Tooltip is an explicit carve-out from the system's usual mobile-first defaults. It is deliberately shadow-free (no `shadow.elevation`), since it's meant to read as "a thin text hint," not a floating panel with elevation weight. Every `Tooltip.Root` must live inside a `Tooltip.Provider`, which shares hover-intent timing across sibling tooltips.

## Do
- Mount a single `Tooltip.Provider` near the app root so hover-intent timing (delay/skip-delay) is shared consistently across all tooltips.
- Use Tooltip only for supplementary, non-essential text (e.g. labeling an icon-only `IconButton`) — never for content the user needs to complete a task.
- Rely on the default `delayDuration` (Radix's 700ms) unless there's specific evidence a shorter delay improves a particular flow.

## Don't
- Don't put interactive content (buttons, links, forms) inside `Tooltip.Content` — it's a passive hint, not a panel; use Popover for interactive floating content.
- Don't assume Tooltip is hover-only — it also opens on keyboard focus (Radix default), so don't add separate keyboard-only affordances on top of it.
- Don't render `Tooltip.Root` outside a `Tooltip.Provider` — it's a required ancestor.

## Accessibility
- **Keyboard:** Tooltip opens on keyboard focus of the trigger (not hover-only, confirmed in `Tooltip.test.tsx`: "opens on keyboard focus"), and closes on Escape or when the trigger blurs.
- **Screen reader:** Radix renders the content with `role="tooltip"`, associated to the trigger via `aria-describedby` — dismissal on Escape/trigger-blur is automatic, not hand-rolled. Verified axe-clean when open.
- **Focus:** Tooltip does not trap or move focus — it simply appears near the currently-focused/hovered trigger and disappears on blur or Escape.

## Props

`Tooltip.Provider` (`TooltipProviderProps`):

| Prop | Type | Default | Description |
|---|---|---|---|
| `delayDuration` | `number` | `700` (Radix default) | Delay in ms before the tooltip opens on hover. |
| `skipDelayDuration` | `number` | `300` (Radix default) | How long, after any tooltip has opened, a subsequent tooltip skips the delay when moving between triggers. |
| `children` | `ReactNode` | — | Subtree sharing this hover-intent timing. |

`Tooltip.Root` (`TooltipRootProps`):

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | — | Controlled open state. |
| `defaultOpen` | `boolean` | `false` | Initial open state for uncontrolled usage. |
| `onOpenChange` | `(open: boolean) => void` | — | Fires when open state changes. |
| `delayDuration` | `number` | — | Per-instance override of the Provider's `delayDuration`. |
| `children` | `ReactNode` | — | `Tooltip.Trigger` + `Tooltip.Content`. |

`Tooltip.Content` (`TooltipContentProps`, extends `Omit<ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>, 'side'>`):

| Prop | Type | Default | Description |
|---|---|---|---|
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'` | Preferred edge to render against the trigger. |
| `sideOffset` | `number` | `6` | Gap between trigger and hint bubble. |

Other exports: `Tooltip.Trigger` — thin forwardRef wrapper around `TooltipPrimitive.Trigger`.

## Related
- Popover — for interactive floating content, or hints that need more than a line of text.
- IconButton — the most common real-world Tooltip trigger (labeling an icon-only control).
