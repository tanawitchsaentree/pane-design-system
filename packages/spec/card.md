# Card

## Usage
Card is a bordered, sectioned content container — for grouping related content that needs stronger visual separation than a horizontal rule (e.g. a settings-page section, a product/profile summary, a pricing tier). Pulled ahead of its original catalog slot because `examples/demo-app/src/App.tsx`'s GAP #1 comment shows a real settings page falling back to `Stack` + `Divider` for section grouping, with no bordered container available. Compose it from `Card.Root` plus any combination of `Card.Header` (title/actions), `Card.Body` (main content), `Card.Footer` (actions/metadata), and `Card.Media` (cover image/photo) — none are required, and order/presence is entirely up to the caller.

Card is **not** a floating layer (unlike Dialog/Popover/Toast) — it sits in the page's normal flow next to sibling content. Per D-008, it therefore carries zero `shadow.*` tokens. Its `surface.raised` fill alone doesn't separate it from the page (measures ~1.06:1 against `surface.canvas`, both themes — imperceptible, confirmed mathematically and by screenshot), so the root's outer boundary against the page runs on `border.interactive` (the same real-boundary token Button/Input/Checkbox/Radio use, clearing WCAG 1.4.11's 3:1 minimum in both themes). Header/footer dividers, which separate content *within* an already-established card rather than the card from the page, stay on the quieter `border.hairline`.

## Do
- Use `clickable` for a card that performs an action or toggles something (e.g. a selectable summary card) — it renders a real native `<button type="button">` wrapping the whole card, with Enter/Space activation and focus-visibility for free.
- Use `clickable` + `asChild` with a supplied `<a href>` (or router `Link`) for a card that **navigates** to another page (e.g. a product card that opens a detail page) — this makes the whole card a real anchor, not a button that happens to navigate.
- Place `Card.Media` first among `Card.Root`'s children for the common "cover image on top" layout — it clips to `Card.Root`'s own corner radius automatically (`overflow: hidden` on the root), so `Card.Media` needs no radius token of its own.
- Pass a `ratio` to `Card.Media` (reuses `AspectRatio`, Wave 1/D-012) when the image should be constrained to a fixed aspect ratio; omit it to let the media size itself naturally.
- For a "media on the side" layout (not "on top"), put `Card.Media` and `Card.Body` as siblings inside a `Flex` — Card doesn't own row/column layout itself, `Flex` already does.
- Pass an `aria-label` on a `clickable` Card when its visible content alone wouldn't make a clear accessible name (mirrors the same expectation `Button`/`IconButton` set).

## Don't
- Don't add `onClick` directly to a non-`clickable` `Card.Root` expecting it to become an accessible click target — a plain `Card.Root` is a `div` with no role/tabIndex; use `clickable` instead, which renders a real `<button>`/`<a>` so keyboard and assistive-tech users get the same affordance mouse users do.
- Don't expect a shadow/elevation on Card — by design (D-008), Card never floats above the page; if you need a genuinely floating panel, reach for Popover/Dialog/Toast instead.
- Don't nest a `clickable` Card inside another `clickable` Card, or put a second interactive element (button/link) *inside* a `clickable` Card's content — a `<button>` cannot contain another `<button>`/`<a>` per HTML content-model rules; if the card needs its own internal actions as well as being clickable as a whole, put those actions in `Card.Footer` and don't set `clickable` on the root (use a per-item click handler on the specific action instead).
- Don't rely on `disabled` when combined with `asChild` — an `<a>` has no native `disabled` attribute (same limitation `Link` doesn't paper over); conditionally omit `href`/the click handler for that case instead.

## Accessibility
- **Keyboard:** A `clickable` Card (without `asChild`) is a native `<button type="button">` — Tab reaches it, Enter/Space activates it, exactly like `Button`. With `asChild`, it's whatever the caller supplies (typically an `<a href>`), which gets native anchor keyboard behavior (Enter activates, no Space activation — standard anchor behavior, not a Card-specific choice).
- **Screen reader:** A non-`clickable` Card has no role and implies no interactivity — assistive tech reads its content as plain structural markup. A `clickable` Card is announced as a button (or, with `asChild`+`<a>`, a link), with its accessible name computed from its content unless an explicit `aria-label` is given.
- **Focus:** `clickable` Card gets the same dedicated `focusRing` token (color/width/offset) every other interactive component in this system uses — not a shadow ring, per D-008.
- **Non-color cue:** `clickable` Card's hover/active states layer an alpha overlay wash (`overlay.hover`/`overlay.pressed`, the same tokens `Button`'s outline/ghost variants use) — the border stays on `border.interactive` at rest and on hover alike (it's already the card's real boundary), so the wash is the operative non-color cue here, never color alone and never a shadow "lift".
- **Disabled:** `clickable` + `disabled` uses the native `<button disabled>` attribute — removed from the tab order, same as any other disabled control in this system.
- Everything above is proven directly in `Card.test.tsx` (role/tag assertions, `userEvent` click + keyboard activation, `toBeDisabled()`, forwardRef, axe) — this is a T2-tier component (no keyboard/focus/overlay complexity beyond what the native `<button>`/`<a>` element already provides), so there is no Playwright conformance spec or Gate Proof mutation for it, unlike Dialog/Popover/Listbox.

## Props

`Card.Root` (`CardRootProps`, extends `ComponentPropsWithoutRef<'div'>`):

| Prop | Type | Default | Description |
|---|---|---|---|
| `asChild` | `boolean` | `false` | Render as the single child element instead of `div`/`button` (Radix-style polymorphism) — pass an `<a href>` for a navigating card. |
| `clickable` | `boolean` | `false` | Makes the whole card a single click target — renders a native `<button type="button">` (or, with `asChild`, the supplied element) wrapping every section. |
| `disabled` | `boolean` | `false` | Disables a clickable card via native `disabled`. Ignored when `clickable` is `false`; has no effect combined with `asChild`. |
| `children` | `ReactNode` | — | `Card.Header`/`Card.Body`/`Card.Footer`/`Card.Media`, in any combination/order. |

`Card.Header` / `Card.Body` / `Card.Footer` (`CardSectionProps`, extends `ComponentPropsWithoutRef<'div'>`): plain padded section wrappers, no additional props.

`Card.Media` (`CardMediaProps`, extends `AspectRatioProps` minus `ratio` made optional):

| Prop | Type | Default | Description |
|---|---|---|---|
| `ratio` | `AspectRatioPreset \| number` | — | Optional fixed ratio, reusing `AspectRatio` (Wave 1) directly. Omit to let the media size itself naturally. |
| `children` | `ReactNode` | — | Typically an `<img>` or this library's `Image` component. |

## Form goal
Surface class (`system/FORM.md`, D-030): stays flat, explicitly exempt from the raised/inset depth token any control/input class carries — a card is the panel material itself, not an object placed on it. D-031 (Foundry pick) widened the root border from hairline to `borderWidth.thick`, matching the reference device bodies' crisper edge, without adding shadow.

## Related
- `AspectRatio` — reused directly by `Card.Media` for the `ratio` prop; no ratio math re-implemented here.
- `Button` — the source of Card's `asChild`/native-`<button>` clickable pattern; a `clickable` Card is, mechanically, a Button-shaped container.
- `RadioCards` — a bordered, clickable card scoped to "choose 1 of N" radio-group selection (D-023); reach for it instead of a group of `clickable` Cards when the cards represent mutually-exclusive choices, not independent actions/links.
- `Divider` — the pattern Card is meant to reduce reliance on for strong section grouping (a `Divider` between `Stack` children is still the right choice for lighter-weight separation that doesn't need a full bordered container).
