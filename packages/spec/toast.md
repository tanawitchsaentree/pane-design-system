# Toast

## Usage
Toast is the system's transient notification stack — short-lived messages (saved, error, background task complete) that appear without interrupting the current flow and auto-dismiss after a delay. Mount a single `ToastProvider` near the app root; any descendant calls `useToast().toast({ title, description, variant, duration, action })` to queue a notification, no prop-drilling required. Toasts render at `z-index: var(--ds-z-index-toast)` (1700) — the highest stacking layer in the system, so a toast is never hidden behind an open Dialog, Popover, or Drawer. New toasts stack at the end of the list, newest closest to the edge they entered from.

## Do
- Mount exactly one `ToastProvider` near the app root and call `useToast()` from anywhere below it, rather than instantiating multiple providers.
- Choose the `variant` (`success`/`warning`/`danger`) that matches the semantic meaning of the message — each drives both an accent-bar color and passes contrast comfortably (4.5:1+ in both themes per `toast.json`'s self-check table).
- Provide `altText` on any `ToastAction` (e.g. "Undo") since the visible label alone may not carry enough context out of visual layout.

## Don't
- Don't use the `default` variant to convey feedback (error/success/warning) — it's the neutral "no particular feedback" case; use the matching semantic variant instead.
- Don't rely on Toast for messages the user must act on before proceeding — that's Dialog's job; Toast auto-dismisses and can be missed.
- Don't hand-roll swipe-to-dismiss, auto-dismiss timers, or the `aria-live` announcer region — all of it comes from `@radix-ui/react-toast` (pause-on-hover/focus included).

## Accessibility
- **Keyboard:** No focus trap (toasts are non-blocking); Radix's swipe-to-dismiss and pause-on-hover/focus behavior apply to pointer/focus interaction, and the built-in close button is a standard focusable `IconButton`.
- **Screen reader:** The toast viewport is an `aria-live` announcer region (Radix `ToastPrimitive.Provider`/`Viewport`) so new toasts are announced without stealing focus; `Toast.Title`/`Toast.Description` supply the announced text. Verified axe-clean when a toast is visible in `Toast.test.tsx`.
- **Focus:** Toast never moves focus into itself on open (non-modal notification) and never traps it — verified indirectly since tests interact with the trigger/close button without any focus-trap assertions.

## Accessibility exception (E-001, accepted, narrow scope)
The `default` variant's accent bar consumes `color.border.interactive`, which measures **2.99:1** against `color.surface.overlay` in dark theme — marginally under the 3:1 UI-boundary minimum (about 0.5% short). This is recorded as exception **E-001** and accepted per **D-019**/**D-021**: the accent bar is a decorative, non-boundary cue (it doesn't delineate the panel's edge — the panel itself relies on `shadow.elevation.md` plus a surface-lightness jump for that, per braun-flat rule 5), and it's not the only cue present. The scope is deliberately narrow — it applies **only** to this one decorative accent bar, and explicitly must **not** be cited as precedent for any real border, divider, focus ring, or input boundary that measures under 3:1. It does **not** apply to the `success`, `warning`, or `danger` variants, which reuse `color.feedback.*` and clear 4.5:1+ comfortably in both light and dark themes (per the contrast table in `packages/tokens/src/component/toast.json`). If this needs closing later, the documented fix is to move the accent's ramp step up one notch and re-measure impact on shared tokens.

## Props

`ToastProvider` (`ToastProviderProps`):

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | App subtree that can call `useToast()`. |
| `duration` | `number` | `5000` | Default auto-dismiss delay (ms) for toasts that don't specify their own `duration`. |
| `placement` | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left'` | `'bottom-right'` | Screen corner/edge the toast stack renders in. |
| `label` | `string` | — | Author-localized label announced to screen readers for the toast landmark region. |

`ToastOptions` (passed to `toast()` from `useToast()`):

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `ReactNode` | — | Toast heading. |
| `description` | `ReactNode` | — | Toast body text. |
| `variant` | `'default' \| 'success' \| 'warning' \| 'danger'` | `'default'` | Semantic tone — drives the accent bar + icon color via already-locked `color.feedback.*` tokens (D-006). |
| `duration` | `number` | `5000` (Provider default) | Auto-dismiss delay in ms; pass `Infinity` to require manual dismissal (close button or `action`). |
| `action` | `ReactNode` | — | Optional secondary control (e.g. "Undo"), rendered via `ToastAction`. |

`useToast()` returns `{ toast: (options: ToastOptions) => string, dismiss: (id: string) => void }`. Throws descriptively if called outside a `ToastProvider`.

## Related
- Snackbar — a thin, single-instance wrapper reusing this same `ToastProvider`/context (via an internal `useToastInternal` hook) for single-line, non-stacking messages.
- Dialog — for notifications that must block the page and require an explicit decision.
