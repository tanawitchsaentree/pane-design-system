# Avatar

## Usage
Avatar displays a user/entity image with an automatic fallback to initials (or short text) when no `src` is given, or when the image fails to load. It's a client component (`"use client"`) because it tracks image-load-error state internally to perform that swap. Use it for user profile pictures, team member lists, or any identity representation that needs a graceful fallback.

## Do
- Always provide `alt` when `src` is set — it's a required prop precisely because there's no safe default.
- Provide `fallback` (initials or short text) alongside `src` so a broken image degrades gracefully instead of showing a broken-image icon.
- Pick `shape` (`circle`/`square`) to match the surrounding UI convention consistently.

## Don't
- Don't rely on Avatar for arbitrary content images (hero images, gallery tiles) — use Image, which is the plain-content case without fallback-on-error behavior.
- Don't omit both `alt` and `fallback` — the fallback-only case still needs a name for assistive tech (it defaults to `'Avatar'` only as a last resort).

## Accessibility
- **Keyboard:** N/A — Avatar is non-interactive and never receives focus.
- **Screen reader:** When an image renders successfully, it exposes the required `alt` as its accessible name. When falling back (no `src`, or the image errored), the fallback `span` gets `role="img"` + `aria-label` (using `alt` or `fallback` text, defaulting to `'Avatar'`) so a screen reader gets a real name instead of reading raw initials as if they were a word.
- **Focus:** Not focusable; no focus-visible styling is defined.

## Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `src` | `string` | `undefined` | Image URL. When provided, `alt` is required. |
| `alt` | `string` | required if `src` set | Describes the image for assistive tech. |
| `fallback` | `string` | `undefined` | Initials/short text shown if `src` is omitted or the image fails to load. |
| `size` | `AvatarSizeToken` | `'md'` (40) | `size.avatar.*` t-shirt scale — 24/32/40/48/64/96 (D-004). |
| `shape` | `'circle' \| 'square'` | `'circle'` | Shape. |

## Related
- Image — the plain-content image component (no error-fallback behavior); use Avatar specifically for the "picture that might fail to load and needs a fallback" case.
- Badge — commonly composed alongside Avatar in UI (e.g. an online-status indicator), though not directly integrated by Avatar itself.
