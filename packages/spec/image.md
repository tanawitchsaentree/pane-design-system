# Image

## Usage
Image wraps a native `<img>` for plain content images — article heroes, gallery tiles, any picture that isn't expected to need a fallback-on-error state. It optionally composes Wave 1's `AspectRatio` component to constrain the image to a fixed ratio instead of relying on intrinsic dimensions, and supports optional corner rounding (D-008 soft-rounded scale). It ships no client-side error/fallback state of its own — that concern belongs to Avatar.

## Do
- Always provide a real, descriptive `alt` — it's a required prop, never defaulted or omitted.
- Use `ratio` (via the composed AspectRatio) whenever the image needs to hold a fixed frame independent of its natural dimensions, e.g. in a grid of cards.
- Leave `loading='lazy'` (the default) unless the image is above the fold and needs `eager` loading.

## Don't
- Don't use Image for pictures that might fail to load and need an initials/placeholder fallback — use Avatar for that case instead.
- Don't skip `alt` or pass an empty string for meaningful content images — that removes the image from the accessibility tree entirely, which is only appropriate for decorative images.

## Accessibility
- **Keyboard:** N/A — Image is non-interactive and never receives focus.
- **Screen reader:** `alt` is a required prop and always exposed on the underlying `<img>` as its accessible name/description; there is no fallback path that could silently drop it.
- **Focus:** Not focusable; no focus-visible styling is defined.

## Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `src` | `string` | — (required) | Image URL. |
| `alt` | `string` | — (required) | Describes the image for assistive tech; never defaulted/omitted. |
| `ratio` | `AspectRatioProps['ratio']` | `undefined` | Constrains the image to a fixed ratio via AspectRatio (D-012); omit to let the image size itself normally. |
| `fit` | `'cover' \| 'contain'` | `'cover'` | `object-fit` behavior. |
| `radius` | `RadiusToken` | `undefined` | Optional corner rounding (D-008 soft-rounded scale). |
| `loading` | `'lazy' \| 'eager'` | `'lazy'` | Matches native browser lazy-loading. |

## Related
- Avatar — the fallback-aware counterpart for identity images that might fail to load.
- AspectRatio (Wave 1) — composed internally by Image when `ratio` is set.
