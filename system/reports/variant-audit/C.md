## Group C: overlays, feedback, display, type, layout

Sources read: `apps/docs/src/book/meta.json`, `packages/react/src/components/<Name>/<Name>.tsx` + `.module.css`, `apps/docs/src/book/states.tsx`.
Refs: MUI, Carbon, Ant (AntD), HIG, Radix/shadcn (Radix), Chakra, Fluent 2 (Fluent).

**Cross-cutting matrix gap:** `STATE_ROWS` has only the families Fields/Choices/Ranges/Files/Actions/Tables. **None of the 35 components in group C has a row.** That means no open/closed cell for overlays, no loading/error/fallback cell for Image or Avatar, no tone cells for Toast/Banner/Badge, and no truncate cell for Text. G-SV1 therefore measures nothing here. Proposed new families: Overlays (Dialog, Sheet, Drawer, ActionSheet, Popover, Tooltip), Feedback (Toast, Snackbar, Banner, Spinner, Skeleton, PullToRefresh), Display (Avatar, Badge, Tag, Card, Image, Carousel, Link).

### Dialog
- has: title, description, body, actions slot, controlled/uncontrolled open, `size` md|lg, `Dialog.Close`, modal scrim (Radix), focus-visible, forced-colors, `preview`
- missing:
  - P1 · alert dialog (`role="alertdialog"`, no outside-click/Esc dismiss, focus on the least destructive action) · MUI, Carbon, Ant (Modal.confirm), HIG, Radix (AlertDialog), Chakra, Fluent · every delete/discard flow needs it. Today any confirm closes on a scrim click
  - P1 · scroll body with sticky header and footer · Carbon, MUI (scroll="paper"), Fluent, Chakra (scrollBehavior="inside") · CSS puts `overflow-y:auto` on the whole card, so the actions scroll out of view in long dialogs. Only `.body` should scroll
  - P1 · fullscreen on small screens (`fullScreen` / responsive size) · MUI, Carbon, HIG (full-screen modal), Chakra (size="full") · a 44px-touch system needs a mobile takeover mode. Today only md and lg exist
  - P2 · size sm (narrow confirm) and xl/full · MUI (xs–xl), Carbon (xs/sm/md/lg), Chakra, Ant (width) · confirms look too wide at md
  - P2 · `dismissible={false}` / persistent (block Esc + outside click) · MUI, Ant (maskClosable, keyboard), Chakra (closeOnOverlayClick), Radix (onInteractOutside) · used for required-choice and in-progress states
  - P2 · built-in close (X) button in the header · Carbon, Ant, Chakra, Fluent, shadcn · each team builds its own today
  - P2 · pending/loading confirm state (primary busy, dialog locked while the promise runs) · Ant (confirmLoading), Carbon (InlineLoading in footer), Fluent · async delete or save
  - P2 · destructive confirm-by-typing (type the name to enable delete) · Carbon (danger modal), GitHub Primer, Ant pattern · use the critical glyph+word, never a red fill
  - P2 · `initialFocus` / `returnFocus` control · Radix (onOpenAutoFocus), Chakra (initialFocusRef), MUI · the default focus target is wrong for forms or destructive actions
  - P3 · nested / stacked dialogs (lower layer recedes) · Ant, MUI, Chakra, Fluent · the scrim needs to deepen per level
  - P3 · non-modal dialog · Radix (modal={false}), Fluent (non-modal), Ant (mask=false) · for an inspector-style floating panel
  - P3 · passive "acknowledge" variant (one button) · Carbon (passive modal), HIG alert · can be done with actions today
- matrix gaps: no row. Needs cells for open, lg, alert, scrolling body, and pending

### Sheet
- has: side bottom|start|end, drag-down dismiss from the grabber (bottom only, past 1/4 height), title (hideable), description, body, actions, modal scrim, controlled open, preview
- missing:
  - P1 · detents / snap points (medium, large, custom fraction) · HIG (UISheetPresentationController detents), Vaul/shadcn Drawer, Material bottom sheet (half-expanded) · the core iOS sheet behaviour. Today it opens at one height
  - P2 · non-modal / persistent sheet (no scrim, page behind stays interactive, as in Maps) · Material (standard bottom sheet), HIG (largestUndimmedDetent), Vaul (modal=false) · map and media apps
  - P2 · `dismissible={false}` (no drag, no scrim close) · Vaul, MUI, HIG (isModalInPresentation) · forms with unsaved data
  - P2 · side top · MUI (anchor="top"), Chakra (placement="top"), shadcn Sheet · notification shade, search
  - P2 · sizes (block/inline size of side sheets: sm/md/lg/full) · Chakra, Fluent (OverlayDrawer size), Ant (width) · side sheets need a width choice
  - P2 · sticky header and footer while the body scrolls · HIG, Fluent, Vaul · same as Dialog. Check that `.actions` stays pinned
  - P3 · drag-to-dismiss for start/end sides (swipe toward the edge, RTL-aware) · Vaul (direction), MUI SwipeableDrawer · only the bottom grabber drags today
  - P3 · background scale-down effect while open · Vaul (shouldScaleBackground), HIG · fits the glass depth idea
- matrix gaps: no row. Needs cells for bottom, start, end, and dragging. CSS has no style for a dragging state (translate is inline only and there is no `data-dragging` hook)

### Drawer
- has: an alias of Sheet with side start|end (default end). No own CSS
- missing:
  - P1 · persistent / inline (push) drawer that pushes content instead of overlaying · MUI (variant persistent/permanent), Fluent (InlineDrawer), Carbon (side nav rail), Ant (push) · app navigation and filter panels. Pane only has an overlay. Check whether Sidebar covers this before building
  - P2 · mini / rail collapsed state (icons only) · MUI (mini variant), Fluent, Carbon (rail) · may belong to Sidebar
  - P2 · widths sm/md/lg/full · Ant, Chakra, Fluent · see Sheet
  - P2 · non-modal overlay drawer (no scrim, no focus trap) · Fluent (modalType non-modal), Ant (mask=false) · inspector panels
  - P3 · header slot with back/close and a footer slot · Ant (extra/footer), Fluent (DrawerHeader/Footer) · composition
  - P3 · nested drawer (multi-level push) · Ant · niche
- matrix gaps: no row. The Drawer docs should at least prove that start/end flip correctly in RTL

### ActionSheet
- has: title, description, actions[] {label, onSelect, tone default|critical (placed last), icon}, cancel label, controlled open, preview
- missing:
  - P2 · disabled action · HIG (UIAlertAction isEnabled), Ant Mobile ActionSheet (disabled) · an action that is not available right now
  - P2 · per-action description / secondary line · Ant Mobile (description), Material bottom sheet list · e.g. "Share link: anyone with the link can view"
  - P2 · popover presentation on wide screens (anchored to the trigger) · HIG (iPad action sheet becomes a popover) · an action sheet on desktop should anchor like a Menu
  - P3 · hide cancel / cancel optional · Ant Mobile · when a scrim tap is enough
  - P3 · loading action (busy until the promise resolves, then close) · Ant Mobile (onAction async) · async destructive actions
- matrix gaps: no row. Needs default plus a critical-action cell

### Popover
- has: trigger, title, children, side top|right|bottom|left, align start|center|end, sideOffset 8, collision padding 12, controlled open, preview
- missing:
  - P2 · arrow / pointer · Radix (Popover.Arrow), MUI Popper, Ant, Fluent (withArrow), Carbon · helps the eye link the popover to its trigger. The glass needs a matching arrow
  - P2 · close button / `Popover.Close` · Radix, Chakra (PopoverCloseButton), Carbon · no close part is exported
  - P2 · modal popover (focus trap, scrim-less) vs non-modal · Radix (modal), Chakra · forms inside popovers
  - P2 · open on hover (hover card) · Radix (HoverCard), Chakra (trigger="hover"), Ant (trigger hover), Fluent (openOnHover) · user preview cards. Ties in with rich Tooltip
  - P2 · logical sides (inline-start/inline-end) instead of right/left · Pane RTL rule · `side="right"` does not flip in RTL. Rename or map it
  - P2 · `anchor` / virtual anchor (open at the cursor or at a different element than the trigger) · Radix (Popover.Anchor), MUI (anchorEl) · table cell editors
  - P3 · header/footer slots (title + actions row) · Carbon, Fluent (PopoverSurface), Ant (title/content) · `title` renders as a `<p>`. Make it a labelled heading (aria-labelledby). Today aria-label is only set when the title is a string
  - P3 · size/width presets and match-trigger-width · Radix (var(--radix-popover-trigger-width)), Fluent · select-like popovers
- matrix gaps: no row. Needs a cell per side, plus with-title

### Tooltip
- has: content, side top|right|bottom|left, offset 6, collision padding 8, fixed 300ms delay, tap-to-toggle on touch, preview
- missing:
  - P2 · configurable delay / skipDelay (instant after the first one) · Radix (delayDuration, skipDelayDuration), MUI (enterDelay, enterNextDelay), Fluent, Carbon · toolbars need group behaviour. Each Tooltip mounts its own Provider, so the skip delay can never work across tooltips (P2 bug)
  - P2 · align start|center|end · Radix, Fluent, Carbon · for edge-anchored icons
  - P2 · keyboard shortcut slot ("Bold ⌘B") · Carbon, Fluent, HIG, VS Code · compose Kbd inside the tooltip, styled at secondary tone
  - P2 · controlled open / `disabled` (do not show) · Radix (open/onOpenChange), MUI (open, disableHoverListener), Chakra (isDisabled) · cannot be suppressed or driven today
  - P2 · logical sides (RTL), same as Popover · Pane rule
  - P2 · description vs label mode (tooltip as aria-label for icon-only vs aria-describedby) · Fluent (relationship="label|description"), Carbon (IconButton label) · icon-only buttons need the label relationship
  - P3 · rich tooltip / toggletip (title + text + link, interactive) · Carbon (Toggletip), Material 3 (rich tooltip), Fluent (InfoLabel) · Popover/CoachMark may cover this. Document which one to use
  - P3 · arrow · Radix, MUI (arrow), Fluent (withArrow), Ant · optional
  - P3 · tooltip on a disabled trigger (wrapper span) · MUI, Chakra (shouldWrapChildren) · common gotcha
- matrix gaps: no row

### Toast
- has: title, description, single action {label, altText, onClick}, tone info|positive|critical, duration (default 5000), close button, swipe right, preview
- missing:
  - P1 · status rule broken: the tone mark is a coloured dot only, with no glyph and no word. Banner and Badge use glyph + screen-reader word. Toast needs the same GLYPHS plus a toneLabel · Pane concept · without it, colour is the only signal, which breaks the system's own rule and WCAG 1.4.1
  - P1 · stacking / queue: each `<Toast>` mounts its own `RT.Provider` and `RT.Viewport`, so several toasts overlap and nothing limits the count · Sonner/shadcn, MUI notistack (maxSnack), Ant (maxCount), Chakra (useToast), Fluent (Toaster limit) · needs one `<Toaster>` region plus an imperative `toast()` API
  - P1 · imperative API `toast()` / `useToast()` · Sonner, Chakra, Ant (message/notification), Fluent (useToastController), Carbon · real apps fire toasts from handlers, not from JSX open state
  - P1 · RTL swipe: `swipeDirection="right"` is hard-coded · Pane logical-properties rule · in RTL the toast enters from inline-start but swipes the wrong way
  - P2 · warning tone (Banner and Badge have it, Toast lacks it) · Carbon, Ant, Chakra, Fluent, MUI · keep the tone sets aligned
  - P2 · promise / loading toast (pending, then success or error, in the same slot) · Sonner (toast.promise), Chakra (toast.promise), Fluent (update) · uploads and saves. Spinner + word
  - P2 · position / placement (top-end, bottom-center, ...) · Sonner, Ant, Chakra, MUI (anchorOrigin), Fluent · mobile wants bottom-center
  - P2 · pause on hover, focus, and window blur · Sonner, notistack, Fluent (pauseOnHover/pauseOnWindowBlur), Radix (hover only) · document what Radix does by default and add window blur
  - P2 · persistent toast (duration Infinity / until dismissed) for critical tones · Carbon (critical toasts must not auto-dismiss), Fluent · the critical tone should default to staying
  - P2 · update an existing toast by id · Sonner, Chakra, Fluent · progress toasts
  - P3 · "undo" action pattern documented (altText, keyboard path) · Sonner, Gmail · the action exists. Document undo as the canonical use
  - P3 · custom icon / no icon · Sonner, Ant · e.g. a file-type glyph
- matrix gaps: no row. Needs cells for each tone, with-action, and long text. CSS styles `.positive` and `.critical` but has no `.info` rule, so info falls back to an unstyled mark. Confirm this is intended

### Snackbar
- has: message, single action, duration 4000, swipe down, preview
- missing:
  - P1 · queue: same per-instance Provider/Viewport problem as Toast. Snackbars must show one at a time, in order · Material/MUI (consecutive snackbars), notistack · two snackbars overlap today
  - P2 · close button (optional) · MUI (action with close), Material 3 (close affordance) · needed for long or persistent messages
  - P2 · two-line / long message layout with the action stacked below · Material 3 (longer action) · mobile wrapping
  - P2 · placement above a BottomNav/FAB (offset) · Material (anchor above FAB), MUI · BottomNav exists in Pane. The snackbar must clear it
  - P3 · imperative `snackbar()` API · notistack, Material · shared with the Toast fix
- matrix gaps: no row

### Spinner
- has: size sm|md, label (default "loading", role=status), forced-colors, token-level reduced motion
- missing:
  - P2 · lg size and `inherit` (1em, sits inside text or buttons) · Carbon (small/large), Fluent (tiny→huge), Chakra (xs–xl), Ant (small/default/large) · page-level loads and inline text
  - P2 · visible label (label beside or below the spinner) · Fluent (label, labelPosition), Carbon (InlineLoading description), Ant (tip) · "Loading prints…" shown as text, not only to AT
  - P2 · show delay (do not flash for fast loads) · Ant (delay), React Spectrum (delay) · avoids flicker
  - P2 · inline-loading states: active, finished (check + word), error (glyph + word) · Carbon InlineLoading · a common "Saving… / Saved" pattern that Pane lacks
  - P3 · determinate circular progress · MUI (CircularProgress value), Ant (Progress circle), Chakra · Progress is linear. A ring variant would live in Progress
  - P3 · overlay mode (spinner over content, content dimmed, aria-busy) · Ant (Spin wrapping children), Carbon (Loading withOverlay) · card and table loading
- matrix gaps: no row (should show sm, md, and with label)

### Skeleton
- has: shape text|block|circle, lines (last line shorter), breathe (pulse) animation, aria-hidden
- missing:
  - P2 · width/height or size props (or `inlineSize`/`blockSize`) · MUI (width/height), Chakra, Ant (active, size), shadcn · sized by className only today
  - P2 · loaded wrapper (`loading` boolean with children; fades to content) · Chakra (isLoaded), Ant (loading + children), Radix Themes Skeleton · avoids conditional duplication
  - P2 · animation choice pulse | wave | none · MUI (animation), Ant (active), Chakra · `none` matters for long lists and reduced motion
  - P2 · composite presets: avatar + lines, card, list item, table row · Ant (avatar/title/paragraph), Carbon (SkeletonText/SkeletonPlaceholder/DataTableSkeleton), Fluent · speeds adoption
  - P3 · rounded rect vs pill radius choice · MUI (rounded), Ant (round) · match Image radius tokens (media/inner)
  - P3 · a polite "Loading" announcement on the region (aria-busy guidance) · Carbon, Chakra docs · Skeleton is aria-hidden, so the container must announce. Document this
- matrix gaps: no row (text, block, circle)

### PullToRefresh
- has: onRefresh (sync or promise), label, 64px threshold, pointer pull (touch/pen, scrollTop 0), aria-busy, focus-visible refresh affordance
- missing:
  - P2 · exposed phases: idle, pulling, armed (past threshold), refreshing, done · Ant Mobile (pullingText/canReleaseText/refreshingText/completeText), HIG (UIRefreshControl) · the user needs to see "release to refresh". CSS has no data-state hooks
  - P2 · completion feedback (brief "Updated" + time) · Ant Mobile (completeText, completeDelay), HIG · confirms it worked
  - P2 · error state (refresh failed, glyph + word, retry) · Pane rule · a rejected promise is currently swallowed (finally only)
  - P3 · custom threshold / headHeight · Ant Mobile · tuning
  - P3 · disabled · Ant Mobile · while editing
- matrix gaps: no row

### Avatar
- has: name → initials (2 letters), src image, size sm|md|lg, decorative mode, role=img + aria-label
- missing:
  - P1 · image-failed fallback: no onError, so a broken `src` shows a broken image instead of falling back to initials · Radix (Avatar.Fallback), MUI, Chakra, Ant, Fluent · very common (expired CDN URLs)
  - P1 · AvatarGroup with overflow "+N" and max · MUI (AvatarGroup max/total), Chakra, Ant (Avatar.Group maxCount), Fluent (AvatarGroup) · collaborator lists, shared-with
  - P2 · presence/status badge (online, away, busy, offline) as glyph + word, positioned on the avatar edge · Fluent (PresenceBadge), Chakra (AvatarBadge), Ant (Badge on Avatar) · chat and teams. Shape-coded, not hue-only
  - P2 · icon / anonymous fallback when there is no name or initials · MUI, Ant (icon), Fluent · guest users
  - P2 · image loading state (initials shown until load, delayMs) · Radix (Fallback delayMs) · avoids a flash
  - P2 · sizes xs and xl/2xl · Fluent (16–128), Chakra (2xs–2xl), Ant · table rows (xs) and profile headers (xl)
  - P2 · shape: circle vs rounded square (for orgs, apps, and groups) · Fluent (shape square), Ant (shape), HIG app icons · person vs entity
  - P3 · interactive avatar (button/link with hover, pressed, focus) · Fluent (active ring), Ant · profile menus. Needs a 44px hit area at the sm size
  - P3 · "active" ring / selected · Fluent (active="active") · speaker or story rings
- matrix gaps: no row. Needs cells for image, initials, image-failed, and each size

### Tag
- has: children only (span). No props at all
- missing:
  - P1 · removable tag (close button, 44px hit area, aria-label "Remove X") · Ant (closable), Carbon (DismissibleTag), Chakra (TagCloseButton), MUI Chip (onDelete), Fluent (dismissible) · Pane covers this under Chip (onRemove). State this in the Tag docs or merge the two
  - P2 · clickable / link tag (filters, topic links) with hover, pressed, focus · Carbon (OperationalTag), Ant (CheckableTag), Fluent (InteractionTag) · read-only today. Chip covers selectable, but not link
  - P2 · leading icon / avatar slot · Carbon (renderIcon), Fluent (media), Chakra (TagLeftIcon), MUI (avatar/icon) · file-type and person tags
  - P2 · size sm|md · Carbon (sm/md/lg), Chakra, Fluent · dense tables
  - P2 · disabled · Carbon, Ant, Fluent · in a disabled form
  - P3 · status tags (glyph + word, neutral surface) · Carbon tag types, Ant presets · Badge already covers status. Document "Tag = metadata, Badge = status"
  - P3 · max-width with truncation + tooltip · Carbon, Ant · long labels
- matrix gaps: no row

### Badge
- has: tone neutral|info|positive|warning|critical (glyph for each non-neutral), `dot` (neutral only), children label
- missing:
  - P1 · numeric count with max ("99+") and hide-when-zero (showZero) · MUI (max, showZero, invisible), Ant (count, overflowCount), Chakra, Fluent (CounterBadge overflowCount) · unread counts on tabs, inbox, and cart
  - P1 · positioned/anchored badge on an icon, avatar, or IconButton (top-end corner, logical, overlap circle/rect) · MUI (anchorOrigin, overlap), Ant (Badge wrapping children, offset), Fluent · notification bell. Needs RTL-aware placement
  - P2 · standalone dot (no label) as an "unread / new" indicator, with an SR word · MUI (variant="dot"), Ant (dot), Fluent (PresenceBadge tiny) · `dot` renders only with neutral and needs children
  - P2 · sizes sm|md · Fluent (tiny→extra-large), Carbon, Chakra · dense lists
  - P3 · emphasis levels (subtle vs strong) without hue: outline / tint / solid-glass · Fluent (appearance filled/ghost/outline/tint), Chakra (variant) · stays hue-less; emphasis comes from material
  - P3 · `dot` ignored with non-neutral tones (silent prop conflict) · document it or allow it
- matrix gaps: no row. A `dot` + tone combination has no style (`.dot` only renders for neutral)

### Banner
- has: tone info|positive|warning|critical with glyph + SR word, title, detail children, action slot, onDismiss with leave animation (reduced-motion aware), live polite|assertive
- missing:
  - P2 · page-level / global (full-bleed, top of app, sticky) vs inline (in-content) variant · Carbon (Notification inline vs actionable), Ant (Alert banner), Fluent (MessageBar vs MessageBar in shell), MUI Alert · system outages and trial notices
  - P2 · compact single-line layout (title + action on one row) vs multiline · Fluent (layout="singleline|multiline"), Carbon (lowContrast/inline) · dense dashboards
  - P2 · custom icon or no icon · MUI (icon / icon={false}), Ant (showIcon), Fluent · neutral "tip" banners (no status)
  - P2 · neutral / no-tone banner (promo, tip) · Fluent (MessageBar intent info), Ant · today every banner is a status. A tip should not claim "Info:"
  - P3 · "don't show again" persistence pattern · Carbon pattern, HIG · document only
  - P3 · stacked/grouped banners (MessageBarGroup) · Fluent · several notices at once
- matrix gaps: no row (4 tones, with action, dismissible)

### Environment
- has: brightness dim|mid|bright, material glass|solid. No own CSS (sets context)
- missing:
  - P2 · auto brightness derived from the actual backdrop or image luminance (sample content) · HIG (vibrancy adapts), Fluent (Mica/Acrylic adapt) · Pane takes its colour from content, so detecting brightness is the natural next step
  - P3 · reduced-transparency forced: an explicit `material="solid"` default when `prefers-reduced-transparency` is set (Card handles the media query. Confirm that Environment does too) · HIG (Reduce Transparency) · a11y
  - P3 · contrast "increased" mode · HIG (Increase Contrast), Fluent (high contrast) · forced-colors is covered. The `prefers-contrast: more` media query is not
- matrix gaps: no row (should show dim, mid, and bright for a sample Card)

### Card
- has: variant glass|inset, level 1–4 (depth), `as` element, CardCover (background-image), reduced-transparency + forced-colors CSS
- missing:
  - P1 · interactive card (whole card is a link or button: hover lift, pressed, focus-visible ring, disabled) · MUI (CardActionArea), Carbon (clickable/selectable tile), Ant (hoverable), Fluent (Card onClick, focusMode), Chakra · product grids and settings tiles. CSS has no hover, focus, or pressed rule
  - P1 · selected / selectable card (checkbox or radio semantics, chosen-glass state) · Carbon (SelectableTile, RadioTile), Fluent (selected, checkbox), Ant (Checkable card) · RadioCards covers single choice. Multi-select cards are missing
  - P2 · header / body / footer / actions slots (CardHeader with title, meta, menu) · MUI (CardHeader/Content/Actions), Fluent (CardHeader/Footer/Preview), Ant (title/extra/actions), shadcn · composition consistency
  - P2 · loading card (skeleton body) · Ant (loading), Fluent · ties to Skeleton composites
  - P2 · CardCover should be an `<img>` (alt, lazy, aspect ratio, error fallback) rather than a CSS background · MUI (CardMedia component="img"), Fluent (CardPreview) · a background-image has no alt, no lazy loading, and no error state
  - P2 · orientation horizontal (media at inline-start) · Fluent (orientation), MUI pattern, Ant (Card.Meta) · list cards
  - P3 · expandable/collapsible card · Carbon (ExpandableTile), MUI (Collapse in Card) · Accordion may cover this
  - P3 · padding/size density sm|md|lg · Fluent (size), Ant (size small) · dense dashboards
  - P3 · disabled card (dimmed, not focusable) · Carbon (Tile disabled), Fluent · for selectable cards
- matrix gaps: no row. glass/inset × levels 1–4 is not shown side by side, and there is no hover, selected, or focus cell

### Mesh
- has: preset aurora|ember|tide|dusk, custom 4 colours, base, rotate, glow, label (img role), forced-colors
- missing:
  - P2 · `from` image: derive the mesh colours from a content image (content-derived hue, Pane's concept) · HIG (wallpaper tint), Material You (dynamic colour) · exactly the "colour comes from content" job. Today colours are passed in by hand
  - P3 · slow animated drift with reduced-motion off-switch · Apple (Music/Weather animated mesh), Stripe · ambience
  - P3 · `decorative` (aria-hidden) when label is omitted · a11y · confirm that the default is decorative
  - P3 · grain/noise overlay toggle (avoids banding) · common mesh gradient practice · quality on 8-bit displays
- matrix gaps: no row

### Image
- has: alt (required), radius media|inner|none, fit cover|contain, lazy by default, async decoding, data-state loading|loaded|error (styled: dim while loading, carve on error)
- missing:
  - P1 · error fallback content (icon + "Image unavailable" word, or a `fallback` node / fallbackSrc) · Ant (fallback), Chakra (fallbackSrc/fallback), Fluent, MUI pattern · the error state today is only an inset carve around a broken-image icon
  - P2 · placeholder / blur-up (low-res or blurhash `placeholder`) with a fade-in on load · Next/Image (placeholder="blur"), Ant (placeholder), Chakra · photo-heavy products. Pane is content-coloured, so blur-up fits
  - P2 · preview / zoom / lightbox (click to open a fullscreen viewer with gallery navigation) · Ant (Image.PreviewGroup), Fluent pattern, Chakra pattern, HIG Quick Look · stores and galleries
  - P2 · more fit modes (fill, none, scale-down) and object-position · Chakra (objectFit, objectPosition), Fluent (fit="none|center|contain|cover|default") · focal points
  - P2 · aspect-ratio prop (reserve space, avoids layout shift), or document AspectRatio composition · Fluent, Next/Image (width/height) · CLS
  - P3 · `sizes`/`srcSet` guidance and a `priority` (eager, fetchpriority=high) flag for the hero image · Next/Image · LCP
  - P3 · shape circle / bordered / shadow · Fluent (shape, bordered, shadow), Ant · thumbnails
- matrix gaps: no row. loading, loaded, and error are styled in CSS but never shown

### Carousel
- has: label, perView 1|2|3, scroll-snap track (focusable), prev/next IconButtons (disabled at ends), position dots (aria-hidden, not clickable), live "n of m" count, reduced-motion scroll
- missing:
  - P1 · keyboard arrow navigation on the track · APG carousel, Ant, Chakra/Embla, Fluent · tab-focus scrolls natively, but Left/Right arrows (RTL-flipped) are expected
  - P2 · clickable indicators (dots as tabs, 44px hit area) · APG (tabbed carousel), Ant (dots), MUI patterns, Fluent (CarouselNav) · dots are decorative only
  - P2 · autoplay with a visible pause/play button, pausing on hover/focus, off under reduced motion · APG (rotation control required), Ant (autoplay), Fluent (autoplay button) · hero rotations. A11y requires the pause control
  - P2 · loop / infinite · Ant (infinite), Embla (loop), Fluent (circular) · galleries
  - P2 · peek (partial next slide visible) and gap/spacing control · Fluent (peeking), HIG (App Store shelves), Embla · signals that the row scrolls
  - P2 · responsive perView (1 on mobile, 3 on desktop) · Ant (responsive), Embla breakpoints · perView is a fixed number today
  - P2 · controlled index (activeIndex / onIndexChange) · Fluent (activeIndex), Ant (goTo/afterChange) · sync with other UI
  - P3 · thumbnail navigation strip · Ant pattern, Fluent pattern · product photos
  - P3 · vertical orientation · Ant (dotPosition/vertical), Embla axis y · reels
  - P3 · fade transition instead of slide · Ant (effect="fade") · hero
  - P3 · hide controls / custom control placement (overlay on media vs below) · Fluent, Ant (arrows) · media carousels
- matrix gaps: no row. Needs first-slide (prev disabled) and last-slide (next disabled) cells

### Heading
- has: level 1–6, size title|display|headline|emphasis decoupled from level (default mapping by level)
- missing:
  - P2 · truncate / line-clamp · Chakra (noOfLines), Ant Typography (ellipsis rows), MUI (noWrap) · card titles
  - P2 · tone secondary · Chakra, Ant (type="secondary") · subdued section headers
  - P3 · text-wrap balance option · modern CSS (text-wrap: balance), Radix Themes · nicer display headings
  - P3 · eyebrow / overline companion · MUI (overline), Carbon pattern · section labels above headings
  - P3 · weight override · Radix Themes (weight), Chakra · rarely needed
- matrix gaps: no row (a type specimen of level × size)

### Text
- has: size reading|body|label|caption|micro, tone primary|secondary, weight regular|medium|semibold, `as` element, truncate (single line)
- missing:
  - P1 · multi-line clamp (`lines={2}`), with an expand/"more" option · Chakra (noOfLines), Ant (ellipsis rows+expandable), MUI, Radix Themes · descriptions in cards and lists. Single-line truncate is not enough
  - P2 · mono / code style and tabular numerals · Ant (code, keyboard), Radix Themes (Code), Carbon (code-01), Fluent (font="monospace", numeric) · IDs, prices, tables. Tabular numbers are important for Stat and Table
  - P2 · alignment (start|center|end, logical) · Radix Themes (align), Fluent (align) · empty states
  - P2 · status text (glyph + word) / disabled tone · Ant (type success/warning/danger, disabled) · inline validation text outside FormField. Check whether HelperText covers this
  - P3 · bold weight · Fluent, Radix · display totals
  - P3 · `mark`/highlight, strikethrough, underline, italic · Ant (mark/delete/underline), Fluent (strikethrough/underline/italic), Radix (Em/Strong) · search highlights
  - P3 · copyable text · Ant (copyable) · IDs
  - P3 · wrap control (nowrap, pretty, balance) · Radix Themes (wrap), Fluent (wrap) · labels
- matrix gaps: no row. truncate has no visual proof

### Link
- has: variant inline|standalone, external (target _blank, rel, SR "opens in a new tab"), hover, focus-visible, forced-colors
- missing:
  - P2 · visible external glyph (↗) for external links, mirrored in RTL · Carbon (renderIcon), Fluent pattern, GOV.UK, HIG · external is SR-only today, so sighted users cannot tell
  - P2 · visited state · Carbon (visited prop), GOV.UK · long docs and lists of results. CSS has no :visited rule
  - P2 · disabled link (aria-disabled, no href, dimmed) · Carbon (disabled), Fluent (disabled, disabledFocusable), MUI · gated features
  - P2 · current page (`aria-current="page"`) style · Carbon, GOV.UK, Fluent (in nav) · in-content nav. Check whether Breadcrumb/NavigationMenu covers this
  - P2 · `asChild`/polymorphic for router links (Next Link, React Router) · Radix (asChild), MUI (component), Chakra (as), Fluent · every SPA needs it. Check whether a plain `<a>` blocks client routing
  - P3 · underline control (always / hover / none) · MUI (underline), Radix Themes (underline) · standalone links in nav
  - P3 · sizes matching Text sizes (inherit vs sm/lg) · Carbon (size sm/md/lg), Radix Themes · standalone link lists
  - P3 · subtle tone (secondary) · Fluent (appearance="subtle") · footers
- matrix gaps: no row (inline, standalone, external, visited, disabled)

### Icon
- has: children (svg), size sm|md, label (role=img) or aria-hidden, forced-colors
- missing:
  - P2 · inherit size (1em, follows text) and lg/xl sizes · Chakra (boxSize), MUI (fontSize="inherit/small/large"), Fluent (sizes 16–48), Carbon (16/20/24/32) · inline icons and empty-state icons
  - P2 · tone secondary / inherit currentColor documented · MUI (color), Fluent · hue-less means currentColor or secondary only
  - P3 · RTL mirroring flag (`mirrored` for directional glyphs) · HIG (SF Symbols directional), Fluent (flipInRtl), Material · arrows and chevrons must flip
  - P3 · filled vs regular weight variant · Fluent (Filled/Regular), Material (fill), SF Symbols · selected tab icons
- matrix gaps: no row

### Kbd
- has: a `<kbd>` element with styling, nothing else
- missing:
  - P2 · combo / chord rendering (`keys={['mod','K']}` → ⌘ K or Ctrl K with a separator) · Mantine/Chakra pattern, HIG (shortcut glyphs), Fluent pattern, Carbon · CommandPalette and menus need it
  - P2 · platform-aware `mod` key (⌘ on Mac, Ctrl elsewhere) with SR words ("Command") · HIG, VS Code · glyphs alone read badly in screen readers
  - P3 · size sm|md (inside Tooltip and Menu items vs body text) · Mantine, Radix Themes (size) · dense contexts
  - P3 · sequence (G then I) vs simultaneous (⌘+K) separator · GitHub, Linear · docs and help sheets
- matrix gaps: no row

### Container
- has: size sm|md|lg|xl|2xl
- missing:
  - P2 · fluid / full width with gutters only · MUI (maxWidth=false), Chakra, Carbon (Grid fullWidth) · dashboards
  - P2 · gutter (padding-inline) control and disableGutters · MUI (disableGutters), Chakra (px) · edge-to-edge media
  - P3 · `as` element (main, section) · Chakra, Radix Themes · landmarks
  - P3 · centerContent · Chakra · splash pages
- matrix gaps: n/a (layout). Docs should show the widths

### Grid
- has: columns (number via a CSS var), GridItem span (number | full) with md and lg responsive spans
- missing:
  - P1 · responsive columns on Grid itself (`columns={{base:1, md:2, lg:4}}`) · Chakra (SimpleGrid), Radix Themes (columns responsive), MUI Grid2, Carbon Grid (sm/md/lg/max) · the most common card-grid need. Today you must set spans on every item
  - P2 · auto-fit by minimum child width (`minChildWidth="16rem"`) · Chakra (minChildWidth), CSS repeat(auto-fill, minmax()) · zero-breakpoint responsive galleries
  - P2 · gap / rowGap / columnGap props on the token scale · Chakra, Radix Themes, MUI (spacing), Ant (gutter) · gap is fixed by CSS today
  - P2 · item start / offset and row span · Carbon (offset), Ant (offset/push/pull), Chakra (colStart, rowSpan), MUI (offset) · editorial layouts and dashboards
  - P2 · sm breakpoint span (GridItem has base, md, lg but no sm/xl) · Carbon (sm/md/lg/xlg/max), MUI (xs–xl) · tablet vs phone
  - P3 · template areas (`areas`) · Chakra (templateAreas), Radix Themes (areas) · app shells (AppShell may cover this)
  - P3 · alignment (align/justify items) · Radix Themes, Chakra · centering in cells
  - P3 · dense flow · CSS grid-auto-flow dense · masonry-ish
- matrix gaps: n/a

### Stack
- has: direction column|row, gap xs|sm|md|lg|xl, align start|center|end|stretch
- missing:
  - P2 · divider between items · Chakra (divider), MUI (divider), Fluent pattern · settings lists
  - P2 · wrap · Chakra (Wrap/flexWrap), MUI (useFlexGap + flexWrap), Ant Space (wrap) · tag rows. Flex has wrap; Stack does not
  - P2 · responsive direction (column on mobile, row on desktop) · MUI (direction={{xs, sm}}), Chakra · the classic form-row case
  - P2 · justify (start|center|end|between) · MUI, Chakra, Ant Space · toolbars
  - P3 · gap none and 2xl (match the Spacer and Flex scales) · token parity · Flex has "none" but Stack does not
  - P3 · `as` element (ul/ol for semantic lists) · Chakra, MUI (component) · list semantics
  - P3 · reverse order · Chakra (direction row-reverse) · RTL is handled by logical flow; reverse is rarely needed
- matrix gaps: n/a

### Flex
- has: direction row|column, gap none–xl, justify start|center|end|between, align start|center|end|stretch|(baseline?), wrap boolean
- missing:
  - P2 · responsive props (direction, gap, wrap per breakpoint) · Chakra, Radix Themes, MUI (sx) · see Stack
  - P2 · justify around|evenly · Chakra, Radix Themes · even toolbars
  - P3 · inline flex (`display: inline-flex`) · Radix Themes (display) · inline groups
  - P3 · `as` element · Chakra, Radix · semantics
  - P3 · wrap-reverse / reverse direction · Chakra · niche
- matrix gaps: n/a

### Box
- has: padding / paddingInline / paddingBlock (none–xl), radius none|inner|media|round, `as` element
- missing:
  - P3 · margin props (marginBlock etc.) · Chakra, MUI Box, Radix Themes · Pane prefers gap, so this may be intentional. Document it
  - P3 · surface / material (glass, inset) shortcut · Pane already covers this as Card. State that Box has no surface by design
  - P3 · responsive padding · Chakra, Radix · mobile density
  - P3 · overflow, position, and display utilities · Chakra, Radix Themes · utility-prop debate. Likely out of Pane's scope
- matrix gaps: n/a

### Center
- has: inline (inline-flex) toggle
- missing:
  - P3 · Square / Circle helpers (fixed-size centered box for icons) · Chakra (Square, Circle) · icon tiles
  - P3 · `as` element and a min-block-size (fill viewport) option · Chakra · splash and empty pages
- matrix gaps: n/a

### Spacer
- has: size xs–2xl (fixed space)
- missing:
  - P2 · flexible spacer (flex: 1 that pushes siblings apart) · Chakra (Spacer = flex grow), SwiftUI (Spacer) · the most common reason to reach for a Spacer (toolbar: title …… actions). The fixed-size Spacer duplicates gap
  - P3 · axis (inline vs block) · Radix/Primer patterns · in row layouts a fixed Spacer should add inline space, not block space. Verify
- matrix gaps: n/a

### Divider
- has: orientation horizontal|vertical, inset (boolean), decorative (role none) vs separator
- missing:
  - P2 · label / text in the middle ("or", section names) with alignment start|center|end · MUI (children, textAlign), Ant (orientation/titlePlacement), Fluent (alignContent), Chakra · auth forms ("or continue with"). Pane has AuthForm, which probably needs it
  - P2 · inset variants: start-only (list inset past the avatar) vs both · MUI (variant="inset" vs "middle"), HIG (separator inset) · list rows. A boolean is too coarse
  - P3 · appearance strong vs subtle, and dashed · Fluent (appearance strong/brand/subtle), Ant (dashed), Carbon · keep it hue-less: strength only
  - P3 · spacing (margin) presets · Ant (plain/size), Chakra · rhythm
- matrix gaps: n/a

### AspectRatio
- has: ratio named presets (square, photo, video, portrait, ...)
- missing:
  - P2 · custom numeric ratio (`ratio={21/9}` or "3/2") · Radix (ratio number), Chakra (ratio), MUI pattern · cinematic heroes and product shots
  - P3 · responsive ratio (square on mobile, video on desktop) · Chakra (responsive ratio) · cards
- matrix gaps: n/a

### VisuallyHidden
- has: focusable (skip-link style: shown on focus)
- missing:
  - P3 · `as` / asChild (render as label, h2, span) · Radix (asChild), Chakra (VisuallyHiddenInput) · hidden headings for landmarks
  - P3 · VisuallyHiddenInput helper for custom controls · Chakra · native-input-behind-custom-UI patterns
- matrix gaps: n/a

---

## Top P1 across group C
1. Matrix: `STATE_ROWS` has no row for any group-C component. Add Overlays/Feedback/Display families (open, tones, loading/error, fallback, truncate)
2. Toast: the tone mark is a colour-only dot. Add glyph + SR word, as in Banner and Badge (breaks Pane's own status rule and WCAG 1.4.1)
3. Toast: one Provider/Viewport per instance. Needs a single `<Toaster>` with stacking and a max count
4. Toast: imperative `toast()` / `useToast()` API (also update by id and promise toasts)
5. Toast: `swipeDirection="right"` is hard-coded and swipes the wrong way in RTL
6. Snackbar: no queue, so snackbars overlap (same root cause as Toast)
7. Dialog: alert dialog (role=alertdialog, not dismissible by scrim or Esc) for destructive confirms
8. Dialog: the whole card scrolls. Only the body should scroll, with sticky title and actions
9. Dialog: fullscreen/responsive mode on small screens (plus sm and xl sizes)
10. Sheet: detents / snap points (medium/large) as in iOS sheets
11. Drawer: persistent/inline push mode (or confirm that Sidebar owns it)
12. Avatar: no fallback when the image fails (no onError, so a broken image shows)
13. Avatar: AvatarGroup with max and "+N" overflow
14. Badge: numeric count with max "99+" and hide-at-zero
15. Badge: anchored placement on an icon, avatar, or IconButton (logical top-end, overlap shape)
16. Tag: no props at all. Removable tag is missing (exists as Chip onRemove). Merge or document
17. Card: interactive card (link/button area with hover, pressed, focus-visible, disabled). CSS has none
18. Card: selectable/selected card for multi-select (RadioCards covers single choice only)
19. Image: real error fallback (glyph + word or fallback node), beyond the carve
20. Carousel: arrow-key navigation (RTL-aware) on the track
21. Text: multi-line clamp (`lines`) with optional expand
22. Grid: responsive `columns` on Grid itself (base/md/lg), not only per-item spans
