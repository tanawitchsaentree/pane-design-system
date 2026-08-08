# Snackbar

## Usage
Snackbar is a single-line, single-instance notification for lightweight confirmations (e.g. "Link copied to clipboard"). Rather than shipping as a separate component with its own provider/portal/viewport, it is implemented as a thin wrapper (Reuse Check, D-018) around the exact same `ToastProvider` infrastructure Toast already provides — `useSnackbar()` reuses Toast's internal `toast`/`dismiss` machinery via `useToastInternal()`. It requires the same `ToastProvider` ancestor as Toast; there is no separate `SnackbarProvider`. Its two behavioral differences from a plain Toast: no `title` (message-only, single line) and single-instance semantics (calling `show()` again dismisses any snackbar-shown message still open, so at most one is ever visible at a time).

## Do
- Use Snackbar for brief, single-line confirmations that don't need a heading — Toast's `title`/`description` split is for messages that need both.
- Call `hide()` to dismiss a snackbar programmatically (e.g. once a related async action completes) instead of tracking the toast id yourself.
- Mount the same `ToastProvider` you'd use for Toast — don't look for a separate provider for Snackbar.

## Don't
- Don't expect multiple snackbars to stack — calling `show()` while one is open replaces it, by design (unlike Toast, which stacks freely).
- Don't pass a `title` — `SnackbarOptions` has no such field; use `message` only.
- Don't assume Snackbar and Toast instances are tracked together — the single-instance replacement logic only applies to snackbar-triggered toasts created via `useSnackbar()`; a plain Toast triggered elsewhere in the app is left untouched.

## Accessibility
- **Keyboard:** No focus trap (non-blocking, same as Toast); dismissal via the underlying Toast close button or Escape/swipe behavior inherited from `@radix-ui/react-toast`.
- **Screen reader:** Rendered through the same `aria-live` toast viewport as Toast, so the message is announced without stealing focus. Verified axe-clean when visible in `Snackbar.test.tsx`.
- **Focus:** Never moves or traps focus — confirmed indirectly since tests only interact with trigger/hide buttons without any focus-trap assertions.

## Props

`useSnackbar()` returns `{ show: (options: SnackbarOptions) => void, hide: () => void }`. Throws descriptively (`/ToastProvider/`) if called outside a `ToastProvider`.

`SnackbarOptions`:

| Prop | Type | Default | Description |
|---|---|---|---|
| `message` | `ReactNode` | — | Single-line message — the entire point of a snackbar (no separate title). |
| `action` | `ReactNode` | — | At most one secondary action (e.g. "Retry"/"Undo"), rendered via `ToastAction`. |
| `duration` | `number` | `5000` | Auto-dismiss delay in ms (same default as Toast). |

## Related
- Toast — the underlying provider/context Snackbar reuses; use Toast directly when a message needs a title, needs to stack alongside others, or needs a semantic `variant` other than the neutral default.
- ToastProvider / ToastAction — shared infrastructure both components depend on.
