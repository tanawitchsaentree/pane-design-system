# Drawer

## Usage
Drawer is an edge-anchored overlay panel that slides in from the left, right, or bottom of the viewport. It is built on the exact same `@radix-ui/react-dialog` state machine as Dialog (Reuse Check, D-018) — the only functional difference is the CSS entrance/exit animation (slide-from-edge instead of scale-from-center). Per D-017, the historical Sheet/BottomSheet role is folded into Drawer as `placement="bottom"` rather than shipped as a separate component. Use it for secondary panels (filters, item details, settings) that benefit from a spatial "slide in from an edge" affordance instead of Dialog's centered blocking treatment.

## Do
- Use `placement="bottom"` for the bottom-sheet role instead of looking for a separate Sheet/BottomSheet component — it doesn't exist in this system (D-017).
- Always include a `Drawer.Title` for the accessible name, same requirement as Dialog.
- Use `hideCloseButton` with explicit action buttons when the drawer already has its own dismiss/confirm controls.

## Don't
- Don't expect Drawer to behave differently from Dialog with respect to focus trap/Escape/portal — behavior is identical, only the animation differs.
- Don't reach for a third-party Sheet component or build a new bottom-sheet primitive — `placement="bottom"` covers that need.
- Don't use Drawer for lightweight, non-blocking auxiliary content — that's Popover's job.

## Accessibility
- **Keyboard:** Tab/Shift+Tab cycles focus within the open drawer (focus trap via Radix, identical to Dialog); Escape closes it.
- **Screen reader:** Renders `role="dialog"` (Radix), with `Drawer.Title` supplying the accessible name and `Drawer.Description` linked via `aria-describedby` when present. Verified axe-clean when open in `Drawer.test.tsx`.
- **Focus:** Focus moves into the content on open and returns to the trigger on close, same mechanics as Dialog (inherited from `@radix-ui/react-dialog`).

## Props

`Drawer.Root` (`DrawerRootProps`):

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | — | Controlled open state. |
| `defaultOpen` | `boolean` | `false` | Initial open state for uncontrolled usage. |
| `onOpenChange` | `(open: boolean) => void` | — | Fires when open state changes. |
| `modal` | `boolean` | `true` (Radix default) | Whether the drawer traps focus/inerts the background. |
| `children` | `ReactNode` | — | `Drawer.Trigger` + `Drawer.Content`. |

`Drawer.Content` (`DrawerContentProps`, extends `ComponentPropsWithoutRef<typeof DialogPrimitive.Content>`):

| Prop | Type | Default | Description |
|---|---|---|---|
| `placement` | `'left' \| 'right' \| 'bottom'` | `'right'` | Which viewport edge the panel slides in from. `'bottom'` is full-width and height-capped (the former Sheet/BottomSheet role, D-017); `'left'`/`'right'` are full-height and fixed-width. |
| `closeLabel` | `string` | `'Close drawer'` | Accessible label for the built-in close button. |
| `hideCloseButton` | `boolean` | `false` | Hides the built-in close button. |

Other exports: `Drawer.Trigger`, `Drawer.Title`, `Drawer.Description`, `Drawer.Close` — thin forwardRef wrappers around the corresponding Radix Dialog primitives.

## Related
- Dialog — same underlying primitive and Content shape; use Dialog for centered blocking modals, Drawer for edge-anchored panels including the bottom-sheet case.
- Popover — non-modal alternative for lightweight auxiliary content anchored to a trigger element rather than a viewport edge.
