# Dialog

## Usage
Dialog is the system's blocking modal overlay — use it for tasks that must interrupt the user's flow and require a decision or input before they can return to the page underneath (confirmations, forms, critical alerts). It renders through a portal at `z-index: var(--ds-z-index-modal)` (1400) with `shadow.elevation.lg`, the heaviest elevation permitted in the system, and inerts the background while open. If the interruption doesn't need to be blocking, prefer Popover (non-modal auxiliary panel) or Drawer (edge-anchored panel) instead.

## Do
- Always include a `Dialog.Title` descendant inside `Dialog.Content` — Radix requires it for the dialog's accessible name; wrap it in `VisuallyHidden` if it shouldn't be visible, don't omit it.
- Use `hideCloseButton` together with explicit `Dialog.Close`-wrapped action buttons (e.g. Cancel/Delete) for confirmation dialogs rather than leaving users only the top-right X.
- Use the `size` preset (`sm`/`md`/`lg`/`full`) instead of hand-rolling width overrides.

## Don't
- Don't set `modal={false}` for the common case — Dialog is a blocking modal by definition; reach for Popover or Drawer with `modal=false` instead for non-blocking overlay needs.
- Don't hand-roll focus trap, portal, or Escape-to-close logic — all of it comes from `@radix-ui/react-dialog` per BLUEPRINT §7.
- Don't nest a second modal Dialog inside another without reconsidering the flow — stacking blocking modals is a poor UX pattern even though it's technically supported.

## Accessibility
- **Keyboard:** Tab/Shift+Tab cycles focus only within the open dialog (focus trap via Radix); Escape closes it and returns focus to the trigger.
- **Screen reader:** Renders `role="dialog"` (Radix), announced by its `Dialog.Title` as the accessible name, with `Dialog.Description` (if present) linked via `aria-describedby`. Verified axe-clean when open in `Dialog.test.tsx`.
- **Focus:** Radix moves focus into the content on open (confirmed in tests: `toContainElement(document.activeElement)`); focus returns to the trigger element on close. Background content is made inert while the modal is open.

## Props

`Dialog.Root` (`DialogRootProps`):

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | — | Controlled open state. Omit + use `defaultOpen` for uncontrolled usage. |
| `defaultOpen` | `boolean` | `false` | Initial open state for uncontrolled usage. |
| `onOpenChange` | `(open: boolean) => void` | — | Fires when open state changes. |
| `modal` | `boolean` | `true` | Renders a non-modal dialog (no focus trap/inert background) when `false`. |
| `children` | `ReactNode` | — | `Dialog.Trigger` + `Dialog.Content`. |

`Dialog.Content` (`DialogContentProps`, extends `ComponentPropsWithoutRef<typeof DialogPrimitive.Content>`):

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` | T-shirt width preset; `'full'` fills the viewport. |
| `closeLabel` | `string` | `'Close dialog'` | Accessible label for the built-in close button. |
| `hideCloseButton` | `boolean` | `false` | Hides the built-in close button, for dialogs with their own explicit action buttons. |

Other exports: `Dialog.Trigger`, `Dialog.Title`, `Dialog.Description`, `Dialog.Close` — thin forwardRef wrappers around the corresponding Radix Dialog primitives.

## Related
- Drawer — same `@radix-ui/react-dialog` state machine and Content shape, differing only in CSS entrance/exit animation (edge slide-in vs. center scale).
- Popover — lighter, non-modal alternative for auxiliary panels that shouldn't block the page.
- Toast/Snackbar — for transient notifications instead of a blocking decision point.
