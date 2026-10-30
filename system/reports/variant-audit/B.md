## Group B: selection, menus, navigation

Sources: `apps/docs/src/book/meta.json` (props), `packages/react/src/components/<Name>/<Name>.module.css` (styled states), `apps/docs/src/book/states.tsx` (STATE_ROWS). Refs: MUI(+X), Carbon, Ant, HIG, Radix/shadcn, Chakra, Fluent 2.
Cross-cutting finding: none of the group-B CSS modules has a `prefers-reduced-motion` block (the motion layer may be global, so check that), and Chip, Tabs, Menu, Listbox, Accordion and Breadcrumb-current have no `:hover` rule. STATE_ROWS has no row at all for Menu, ContextMenu, TransferList, Tabs, Navbar, NavigationMenu, Sidebar, BottomNav, Breadcrumb, Pagination, Stepper, Accordion or TableOfContents.

### Chip
- has: toggle (`selected`/`defaultSelected`, aria-pressed, check glyph when on); removable (`onRemove`, `removeLabel`, x button); disabled; :active, :focus-visible, forced-colors. One size, one look. A separate `Tag` component exists.
- missing:
  - P1 · leading icon / avatar slot (`icon`, `avatar`) · MUI, Chakra, Fluent, Carbon · filter chips with a glyph, people chips with Avatar. Pane has Avatar and Icon but nothing to slot them into.
  - P1 · hover style · all · CSS has no `:hover`, so a pointer user gets no affordance on a toggle.
  - P2 · size sm/md (and dense) · MUI, Ant, Chakra, Fluent · filter rows in toolbars and table headers need a compact chip; the 44px target can stay through an invisible hit area.
  - P2 · solid vs soft (outline) emphasis · MUI filled/outlined, Chakra solid/subtle/outline · the hue-free version is glass-raised vs hairline-outline, not a colour.
  - P2 · link/clickable chip (`href`, `asChild`) that isn't a toggle · MUI clickable, Ant CheckableTag · a "navigate to filter" chip.
  - P2 · ChipGroup: single/multi-select group with roving focus and a group label · MUI X/Fluent TagGroup, Ant CheckableTag group, HIG · filter bars, and also the Choice-chip job.
  - P2 · count/badge suffix ("Night 12") · Carbon, Fluent · facet filters.
  - P2 · removable and toggle on one chip (selected filter you can also delete): check the API allows both at once; the matrix has no cell for it.
  - P3 · status chip (glyph and word, no hue) · Carbon tag types, Ant status Tag · may overlap with `Tag`/`Badge`. Note under Tag if so.
  - P3 · truncation with tooltip for long labels · Carbon, Fluent.
  - P3 · drag handle / reorderable chip · MUI X · niche.
- matrix gaps: `onRemove` (removable) has no cell; the hover state isn't styled; there's no `[data-disabled]` cell for a removable chip; there's no cell for selected and disabled together.

### Select
- has: Radix Select; sizes sm/md; placeholder (`[data-placeholder]`); disabled, readOnly (`[data-readonly]`), invalid (`aria-invalid`); open (`[data-state=open]`); highlighted item; checked item (check glyph); disabled option; `hideLabel`; native `name`; typeahead (from Radix).
- missing:
  - P1 · option groups with headers, plus separators · Radix (Group/Label/Separator), MUI ListSubheader, Ant OptGroup, Carbon · any real country/category list.
  - P1 · option leading icon/avatar and secondary description · MUI, Fluent, Ant, Carbon · `SelectOption` is `{value,label,disabled}` only, while `ListboxOption` already has `description`. Align the two.
  - P2 · clearable (reset to placeholder) · Ant allowClear, Chakra, MUI (via an adornment) · optional filters.
  - P2 · loading state (options fetched) with Spinner in the trigger · Ant loading, Carbon skeleton · async forms.
  - P2 · empty state ("No options") · Ant notFoundContent.
  - P2 · lg size / density token · Ant, Chakra, Carbon (sm/md/lg) · hero forms. Fluent has small/medium/large.
  - P2 · leading icon in the trigger (shows the selected option's icon) · Fluent, MUI renderValue · currency and locale pickers.
  - P2 · scroll buttons / long-list max height (Radix ScrollUp/DownButton) · Radix · the Viewport exists, but there's no styled scroll affordance.
  - P2 · mobile: open as a Sheet / native picker under coarse pointer · HIG, MUI native · Listbox CSS has a `.sheet` but Select doesn't use it.
  - P3 · `position="item-aligned"` vs popper · Radix · HIG-style alignment over the trigger.
  - P3 · underline/"inline" (borderless in a sentence or a toolbar) variant · Carbon inline, Fluent underline/borderless · toolbar sort pickers.
  - P3 · required indicator handled by Select itself (only via FormField today).
- matrix gaps: `size="sm"` has no cell; there's no open/highlighted cell (the gate forces hover/focus only); there's no cell for a disabled option. `required` isn't a Select prop at all, though the matrix passes it through FormField. Fine, but inconsistent with Combobox, which has `required`.

### Listbox
- has: single/multiple (`aria-selected`, check glyph); `description` per option; disabled option (`aria-disabled`); disabled whole; invalid; aria-activedescendant navigation (Arrow/Home/End) with typeahead; `.empty`; focus-visible; forced-colors.
- missing:
  - P1 · grouped options with headers · Radix/shadcn Command, MUI, Fluent, Carbon · same data shape need as Select. Do it once in `ListboxOption` and Combobox/MultiSelect/TransferList inherit it.
  - P1 · virtualised long list (1k+ options) · MUI X, Ant virtual, Fluent · Pane has `VirtualList`. Wire it into Listbox and everything inheriting from it.
  - P1 · hover style for options · all · no `:hover` in CSS.
  - P2 · leading icon/avatar slot and trailing meta · MUI ListItemAvatar, Fluent, Ant.
  - P2 · Shift+click / Shift+Arrow range select and Ctrl+A select-all in `multiple` · Fluent, HIG (NSTableView), React Aria · the useListNav keys found are Arrow/Home/End/typeahead only, with no PageUp/PageDown or range.
  - P2 · select-all / indeterminate header row in multiple · MUI X, Ant Transfer · also feeds TransferList.
  - P2 · loading / async "load more" row · MUI, Ant.
  - P2 · read-only · Fluent, React Aria · shows a selection without allowing change. Select has it, Listbox doesn't.
  - P2 · checkbox-style indicator variant for multiple (checkbox vs check glyph) · Fluent, Carbon · makes multi-select more obvious.
  - P3 · size/density (compact rows) · Ant, Fluent.
  - P3 · drag-to-reorder options · MUI X, Ant · ordering lists.
- matrix gaps: `multiple` has no cell; the `description` option isn't shown; there's no disabled-option cell (only the whole list disabled); there's no empty cell although `.empty` is styled; there's no active-descendant (keyboard-highlighted) cell.

### Combobox
- has: input filtering (ComboCore filter), aria-activedescendant, Escape, `emptyText` (empty state), disabled/readOnly/invalid/required, focus-within, chevron, `name`. Options are `ListboxOption`.
- missing:
  - P1 · async options: `loading` state (Spinner and aria-busy), `onInputChange`/debounced search, and a custom `filter` (or `filter={false}` for server search) · MUI, Ant, Carbon, Fluent, React Aria · the commonest real use (user, city or SKU lookup).
  - P1 · clearable (x button that resets value and text) · MUI, Ant, Carbon, Chakra.
  - P1 · grouped options · MUI groupBy, Ant, Fluent (comes from Listbox).
  - P2 · creatable ("Add 'Xyz'") option · MUI freeSolo + filterOptions, Ant tags, Chakra (react-select) · tag and category pickers.
  - P2 · matched-text highlighting in options · MUI (autosuggest-highlight), Carbon, Fluent.
  - P2 · sizes sm/md (Select has them, Combobox doesn't) · all · one size family across fields.
  - P2 · leading icon in the input (search glyph) / start adornment · MUI, Fluent.
  - P2 · open-on-focus vs open-on-type option, plus `autoHighlight`/`autoSelect` behaviours · MUI.
  - P2 · error/"failed to load" state with retry inside the popup · Ant, Carbon.
  - P2 · mobile: full-screen Sheet with sticky input under coarse pointer · HIG, Fluent mobile.
  - P3 · `inlineAutocomplete` (completes the text in the field) · React Aria/WAI-ARIA both-list.
  - P3 · virtualised (via Listbox).
- matrix gaps: `emptyText` (empty state) and the open/highlighted states have no cell; there's no loading cell because the prop doesn't exist.

### Autocomplete
- has: free text with `suggestions: string[]`; disabled/readOnly/invalid/required; `name`. No dedicated CSS (it reuses Combobox styles).
- missing:
  - P1 · async suggestions: loading state, `onInputChange`, debounced fetching · MUI, Ant AutoComplete, Fluent · search-as-you-type is the reason the component exists.
  - P1 · rich suggestions (object options with description/icon/group) rather than `string[]` · MUI, Ant · e.g. recent vs suggested.
  - P2 · clearable · MUI, Ant.
  - P2 · matched-substring highlight · MUI, Carbon.
  - P2 · recent searches / grouped sections ("Recent", "Suggestions") with delete-recent · HIG search suggestions, Ant · overlaps with `SearchInput`/`CommandPalette`, so document which one to use.
  - P2 · empty state ("No suggestions" or nothing shown) · Ant · decide the behaviour, and show it in docs.
  - P2 · sizes sm/md.
  - P3 · min chars before suggesting (`minLength`) · Ant, Carbon.
- matrix gaps: there's no open-suggestions cell. Autocomplete has no CSS module of its own, so check that its states come from Combobox.

### MultiSelect
- has: selected values as removable chips (Backspace removes the last); filtering; `emptyText`; disabled/readOnly/invalid/required.
- missing:
  - P1 · `maxTagCount` / "+3 more" collapse of overflowing chips · Ant maxTagCount, MUI limitTags, Carbon · wide selections break the layout.
  - P1 · grouped options, async/loading (as for Combobox) · MUI, Ant.
  - P1 · clear-all · Ant allowClear, MUI, Carbon (Carbon's filterable multiselect has the count tag with an x).
  - P2 · select-all ("All 24") with indeterminate · Ant, MUI X, Carbon.
  - P2 · `max` selections limit, with the reason disabled options are unavailable · Chakra, Ant · TagInput has `max`, MultiSelect doesn't.
  - P2 · checkbox indicator in options · Carbon, Fluent, MUI (common pattern).
  - P2 · "N selected" summary display mode in place of chips · Carbon (count tag), Fluent · dense toolbars.
  - P2 · creatable · Ant mode="tags", MUI freeSolo.
  - P2 · sizes sm/md.
  - P3 · drag to reorder chips · MUI X.
  - P3 · keep popup open after a pick (`closeOnSelect`) toggle · MUI disableCloseOnSelect.
- matrix gaps: there's no cell for many chips (wrap/overflow), none for empty results, and none for a disabled option.

### Menu
- has: Radix DropdownMenu; entries with `icon`, `shortcut`, `tone: critical`, `disabled`, `'separator'`; `align` start/center/end; highlighted; disabled; forced-colors.
- missing:
  - P1 · submenus (nested entries) · Radix Sub, MUI, Carbon, Ant, HIG, Fluent · the "Move to >" or "Share >" job. `MenuEntry` can't nest.
  - P1 · checkable items (CheckboxItem) and radio groups (RadioGroup/RadioItem) with an indicator · Radix, HIG, Fluent, Carbon (selectable) · "Show grid", "Sort by". Without them, menus can't hold view settings.
  - P1 · group labels / section headers · Radix Label/Group, MUI ListSubheader, Fluent MenuGroupHeader, HIG.
  - P2 · link items (`href`) that render as `<a>` · Radix asChild, MUI · "Open in new tab" and middle-click.
  - P2 · item description (secondary line) · Fluent, Ant, HIG.
  - P2 · `side` (top/bottom/left/right) and `sideOffset`, `collisionPadding` · Radix · only `align` is exposed.
  - P2 · controlled `open`/`onOpenChange` · Radix, MUI · close after async work, tours.
  - P2 · loading item / async menu content · Fluent.
  - P2 · mobile: render as ActionSheet under coarse pointer · HIG · Pane has ActionSheet. Document the hand-off, or switch automatically.
  - P2 · hover style · CSS styles `[data-highlighted]` only, which Radix also sets on pointer move, so it's acceptable. But there's no pressed (`:active`) feedback.
  - P3 · density (compact items) · Fluent, Ant · keep 44px on coarse pointers.
  - P3 · split-button menu composition (Button and Menu) · Carbon, Fluent SplitButton · probably belongs under Button.
  - P3 · typeahead is built in through Radix. Fine.
- matrix gaps: no STATE_ROWS row at all (open, highlighted item, disabled item, critical item, separator, shortcut).

### ContextMenu
- has: Radix ContextMenu wrapping `children`; same `MenuEntry` shape (icon, shortcut, critical, disabled, separator); styles shared with Menu.
- missing:
  - P1 · submenus, checkable/radio items, group labels (same as Menu, shared data shape) · Radix, HIG, Fluent.
  - P2 · long-press on touch documented and tested, plus a visible alternative (a "More" button), because a context menu is undiscoverable · HIG, Fluent.
  - P2 · disabled trigger region (`disabled` on the whole ContextMenu) · Radix.
  - P2 · `modal` toggle and `onOpenChange` · Radix.
  - P3 · per-target dynamic items (a function of the right-clicked row) · Ant, MUI X DataGrid · DataGrid integration.
- matrix gaps: no STATE_ROWS row; no CSS module of its own (it inherits Menu's).

### RadioCards
- has: title and description, check mark; `columns` 2|3; checked (`[data-state=checked]`), hover, focus-visible, disabled card, whole-group disabled, invalid; forced-colors.
- missing:
  - P1 · media slot (icon, image, price/meta in the trailing corner) · Radix Themes RadioCards, Carbon selectable tile, Ant Radio card pattern, Chakra · plan pickers need a price and an icon.
  - P2 · multi-select sibling (CheckboxCards) · Radix Themes, Carbon (selectable tiles), Chakra · "pick add-ons".
  - P2 · orientation/`columns` 1 (stacked list) and auto-fit responsive columns · Radix Themes, Carbon · today only 2|3, with no explicit single column.
  - P2 · sizes / compact density · Radix Themes size 1-3.
  - P2 · readOnly · Fluent · show the chosen plan without allowing change.
  - P2 · indicator position (none/start/end) · Radix Themes, Chakra.
  - P3 · recommended/"Most popular" ribbon slot (glyph and word, not a colour) · common pricing pattern.
- matrix gaps: `columns` 3 has no cell; `description` isn't shown; whole-group `disabled` has no cell (only the per-option one).

### Rating
- has: `max`, readOnly ("shown"), disabled, filled; radio semantics; focus-visible; forced-colors.
- missing:
  - P1 · hover preview (the stars light up to the pointer before you commit) · MUI, Ant, Chakra · no hover handler in Rating.tsx and no `:hover` in CSS. Users can't see what they're about to pick.
  - P2 · half/fractional values (`precision` 0.5, read-only display of 4.3) · MUI precision, Ant allowHalf, Carbon · review averages.
  - P2 · clearable (click the current star again to reset to 0, or `allowClear`) · Ant allowClear, MUI (click again) · a mistaken rating is otherwise permanent.
  - P2 · sizes sm/md/lg · MUI, Ant, Chakra · inline in list rows vs review forms.
  - P2 · value labels/tooltips per step ("Terrible…Excellent"), visible text · MUI getLabelText + labels, Ant tooltips · also helps meaning beyond the glyph count.
  - P2 · invalid/required (as a form field) · Fluent, Chakra.
  - P3 · custom glyph (heart, dot) via `icon`/`emptyIcon` · MUI, Ant character · stays hue-free.
  - P3 · read-only compact display ("4.3 ★ (128)") · Fluent RatingDisplay.
- matrix gaps: none for current props. Hover isn't styled, though the gate forces hover, so the hover cell will equal the default.

### TagInput
- has: Enter/comma commit, paste splitting, duplicate guard, Backspace removes the last, `max`, `hint`, disabled/readOnly/invalid/required; chips; `[data-off]` when at max.
- missing:
  - P2 · suggestions/autocomplete from a list (TagInput with a Combobox) · Ant mode=tags, MUI freeSolo multiple, Carbon · otherwise users invent spellings.
  - P2 · per-tag validation (an invalid tag shown with glyph and word, e.g. a bad email) · Fluent, Carbon, Chakra · email recipient fields.
  - P2 · edit tag in place (double-click / Arrow-left into a tag) · Fluent TagPicker, Gmail-style.
  - P2 · configurable delimiters (space, semicolon, Tab) and `transform` (lowercase, trim) · Chakra, Ant tokenSeparators.
  - P2 · overflow collapse ("+5") · Ant maxTagCount.
  - P2 · clear-all · Ant, Carbon.
  - P2 · sizes sm/md.
  - P3 · drag to reorder · MUI X.
  - P3 · keyboard navigation across tags (Arrow-left/right focus, Delete removes the focused tag) · Fluent, React Aria TagGroup · check this. Only Backspace on an empty input was found.
- matrix gaps: `max` reached (`[data-off]`) has no cell; `hint` isn't shown.

### TransferList
- has: two Listboxes (`labels` tuple), forward/back move buttons, container query stacks it below 34em. Options are `ListboxOption` with descriptions.
- missing:
  - P1 · search/filter per list · Ant showSearch, MUI X, Carbon · unusable past ~30 items.
  - P1 · select-all/indeterminate per list with a count header ("3/24 selected") · Ant, MUI.
  - P2 · move-all buttons (>> / <<) · MUI.
  - P2 · disabled whole and disabled per item; empty-list state ("Nothing chosen") · Ant, MUI.
  - P2 · reorder within the target list (up/down or drag) · Ant (custom), Fluent · column choosers need order.
  - P2 · one-way mode (picked items show an x to remove, with no left/right buttons) · Ant oneWay.
  - P2 · virtualised lists · Ant, MUI X.
  - P3 · tree source (hierarchical) · Ant tree-transfer.
- matrix gaps: no STATE_ROWS row; the CSS has no state selectors of its own (no disabled or empty state).

### Tabs
- has: Radix Tabs compound (Root/List/Trigger/Content); one look (glass track with a sliding pane); active (`[data-state=active]`), :active, focus-visible, forced-colors; RTL-aware indicator placement.
- missing:
  - P1 · overflow handling: scroll buttons or a "More" overflow menu when tabs exceed the width · MUI scrollable, Ant (more dropdown), Carbon, Fluent overflow · `flex-wrap: nowrap` with no affordance means hidden tabs on mobile.
  - P1 · line/underline variant (a page-level navigation tab bar) vs the current enclosed/segmented look · MUI default, Carbon line vs contained, Ant line vs card, Chakra line/enclosed/soft-rounded, Fluent · the current track look overlaps with SegmentedControl, so document when to use each.
  - P1 · vertical orientation styling · MUI, Ant tabPosition, Carbon, Fluent vertical · Radix supports `orientation`, but the CSS has no `[data-orientation=vertical]` rule. Settings pages need it.
  - P1 · disabled tab styling · all · Radix sets `[data-disabled]`, but CSS has no rule.
  - P2 · icon + label and badge/count slot in a trigger · MUI icon, Ant, Fluent, HIG · "Inbox 3".
  - P2 · closable/addable tabs (editable-card) · Ant editable-card, Carbon dismissible, Fluent · document editors.
  - P2 · sizes sm/md/lg · Ant, Chakra, Fluent, Carbon.
  - P2 · `activationMode="manual"` documented for expensive panels · Radix, WAI-ARIA.
  - P2 · lazy/keep-mounted panels (`forceMount`, unmount-inactive) · Radix forceMount, Ant destroyInactiveTabPane, MUI Lab.
  - P2 · full-width/fitted tabs · MUI fullWidth, Chakra isFitted, Ant centered.
  - P2 · link tabs (route-driven, `<a>` with aria-current) · MUI, Next patterns · Navbar does this, but there's no tab-styled link list.
  - P2 · hover style for an inactive trigger · CSS has only :active and focus-visible.
  - P3 · drag to reorder tabs · Ant DnD demo, Fluent.
  - P3 · loading state in a panel (skeleton) · Ant · composition with Skeleton.
- matrix gaps: no STATE_ROWS row (active, inactive, disabled, focus); disabled and vertical are unstyled though Radix props allow them.

### SegmentedControl
- has: sizes md/sm; option disabled; whole disabled; on (`[data-state=on]`), hover, focus-visible; forced-colors.
- missing:
  - P1 · icon-only and icon + label segments (with aria-label for icon-only) · HIG, Ant Segmented icon, Fluent, Carbon ContentSwitcher (icon) · map/list/grid view toggles are normally icons.
  - P2 · full-width (block) · Ant block, HIG · mobile filter bars.
  - P2 · multi-select variant (toggle group) · Radix ToggleGroup type=multiple, MUI ToggleButtonGroup, Fluent · bold/italic/underline in toolbars. Check whether Pane has a ToggleGroup elsewhere.
  - P2 · lg size · Ant (large), Fluent.
  - P2 · vertical orientation · MUI ToggleButtonGroup orientation, Ant vertical.
  - P2 · readOnly · Fluent.
  - P3 · badge/count in a segment · HIG (rare), Ant custom label.
- matrix gaps: `size="sm"` has no cell; there's no option-disabled cell; there's no cell for a selected state that differs from the default (the default already has a selection).

### Navbar
- has: `brand`, `links` with `current` (aria-current page), `actions` slot, `sticky`, hover, focus-visible; nav scrolls horizontally on overflow.
- missing:
  - P1 · responsive collapse: below a breakpoint, links move into a menu button that opens a Drawer/Sheet · MUI AppBar + Drawer, Carbon UI Shell (hamburger), Chakra, Ant · horizontal scroll alone isn't a mobile nav.
  - P2 · dropdown/mega items (a link with children) or composition with NavigationMenu, documented · Carbon HeaderMenu, Ant Menu horizontal.
  - P2 · scrolled state (glass thickens or the hairline appears on scroll) and hide-on-scroll-down · MUI useScrollTrigger, HIG large to inline title · `sticky` exists, but there's no scrolled state.
  - P2 · search slot / centered layout · Carbon, Fluent.
  - P2 · density (compact 48 vs regular 56/64) · MUI dense toolbar, Carbon.
  - P2 · skip-to-content link · Carbon SkipToContent, Fluent · accessibility basic.
  - P3 · link icons and badges · Carbon, Ant.
  - P3 · `onNavigate` for SPA routers (BottomNav has it, Navbar doesn't) · consistency.
- matrix gaps: no STATE_ROWS row (current, hover, sticky); `sticky` has no scrolled state to show.

### NavigationMenu
- has: top-level groups that are either links or disclosures holding `links` with descriptions; `aria-expanded` panel; hover, focus-visible, chevron; custom (not Radix).
- missing:
  - P1 · mobile behaviour: collapses to an accordion inside a Sheet/Drawer · Radix docs pattern, Carbon side-nav fallback, HIG · there's no responsive rule.
  - P2 · current page / active group indicator (aria-current on a link and the parent group marked) · Radix active, Carbon · NavigationMenu has no `current` prop.
  - P2 · link icons and featured card slot in the panel · Radix example (featured), Ant, Fluent.
  - P2 · multi-column panels / grouped links with headings · Radix, Carbon mega-menu.
  - P2 · hover-intent open with delay plus pointer-grace corridor · Radix (delayDuration, skipDelay) · check whether it's click-only.
  - P2 · viewport animation between panels (shared indicator) · Radix Viewport/Indicator.
  - P3 · vertical orientation · Radix orientation.
- matrix gaps: no STATE_ROWS row (open panel, hover, focus); there's no current-page state at all.

### Sidebar
- has: sections with optional title; items with `icon` and `badge` (string); `current` (aria-current page); header/footer slots; hover, focus-visible; forced-colors.
- missing:
  - P1 · collapsed rail (icon-only with tooltips) and a toggle · MUI mini variant, Carbon SideNav rail, Ant Sider collapsed, shadcn Sidebar collapsible="icon", Fluent NavDrawer · the standard admin layout.
  - P1 · nested items (expand/collapse groups, a parent marked active when a child is current) · Carbon SideNavMenu, Ant SubMenu, shadcn SidebarMenuSub, Fluent NavCategory.
  - P1 · mobile off-canvas (in a Drawer below a breakpoint) · MUI temporary drawer, shadcn offcanvas, Carbon · check whether AppShell handles this, and document it if so.
  - P2 · collapsible sections (the title is a disclosure) · shadcn SidebarGroup collapsible, HIG source list.
  - P2 · item actions (hover "…" menu) · shadcn SidebarMenuAction, HIG.
  - P2 · disabled item · Ant, Carbon.
  - P2 · resizable width · HIG (split view), shadcn rail drag.
  - P2 · `onNavigate` for SPA routers · consistency with BottomNav.
  - P3 · density (compact items) · Fluent, Ant.
  - P3 · loading skeleton items · shadcn SidebarMenuSkeleton.
- matrix gaps: no STATE_ROWS row (current, hover, badge).

### BottomNav
- has: icon + label items, numeric `badge`, `current` (aria-current), `position` fixed|contained, `onNavigate`; hover, focus-visible; forced-colors.
- missing:
  - P2 · labels shown only for the active item / hidden labels variant · MUI showLabels, Material 3 · Pane may reject this for clarity. If so, state that.
  - P2 · dot badge (no count) and a 99+ cap · MUI Badge variant=dot, HIG · check overflow of large numbers.
  - P2 · hide on scroll down, show on scroll up · MUI, Material 3, HIG (iOS 26 minimise) · more reading space on mobile.
  - P2 · safe-area inset (env(safe-area-inset-bottom)) · HIG · grep found none, so verify.
  - P2 · central primary action (FAB notch) composition · Material, MUI.
  - P3 · disabled item · MUI.
  - P3 · "More" overflow tab for more than 5 items (HIG More tab) · HIG.
- matrix gaps: no STATE_ROWS row (current, badge, hover).

### Breadcrumb
- has: items (href, label), last one is current (aria-current, semibold, ellipsis); wraps on narrow screens; hover, focus-visible.
- missing:
  - P1 · collapse/ellipsis for long trails ("Home / … / Parent / Current", with the "…" opening a Menu) · MUI maxItems/itemsBefore/After, Carbon overflow, Ant, Fluent, shadcn BreadcrumbEllipsis · deep file and admin paths.
  - P2 · mobile: show only "< Parent" (back-link mode) · Carbon, HIG back pattern.
  - P2 · item icon (home glyph) and a dropdown on an item (sibling switcher) · Ant menu items, Fluent.
  - P2 · custom separator (chevron vs slash) · MUI, Ant, Chakra.
  - P2 · `onNavigate`/`asChild` for router links · shadcn asChild.
  - P2 · sizes (small inline in a page header) · Fluent sizes.
  - P3 · current item as a link (when the current page has sub-states) · Carbon noTrailingSlash/isCurrentPage.
  - Gap: no forced-colors rule in the CSS (most siblings have one).
- matrix gaps: no STATE_ROWS row; no `@media (forced-colors)`.

### Pagination
- has: `page`, `total`, `siblings`, ellipsis gaps, first/last edge buttons, prev/next steps; disabled ends; current (aria-current); hover, focus-visible; forced-colors.
- missing:
  - P1 · page-size selector ("Rows per page 25") and a range label ("1–25 of 312") · MUI TablePagination, Carbon Pagination, Ant showSizeChanger/showTotal · tables need this, so DataGrid probably depends on it.
  - P2 · jump-to-page input · Ant showQuickJumper, Carbon page select.
  - P2 · simple/compact variant ("Page 3 of 12" with prev/next only) for mobile · Ant simple, MUI, Fluent · 7+ buttons don't fit a phone.
  - P2 · sizes sm/md · MUI, Ant, Chakra.
  - P2 · link pagination (`href` per page for SEO) · MUI renderItem + Link, shadcn.
  - P2 · cursor/unknown-total mode (prev/next only with "Load more", no total) · Carbon unbounded, MUI X server mode · API cursors.
  - P2 · `boundaryCount` (how many end pages to show) · MUI.
  - P2 · disabled whole (while loading) · MUI, Ant.
  - P3 · outlined vs plain button look · MUI variant outlined/text, shape rounded.
- matrix gaps: no STATE_ROWS row (current, disabled edge, gap).

### Stepper
- has: steps with label and description; `current` index; done/current/upcoming styles; horizontal/vertical; aria-current; forced-colors. It's display-only. `Wizard` exists separately.
- missing:
  - P1 · error/invalid step (glyph and word "Needs attention") · MUI error, Carbon invalid, Ant status=error, Fluent · forms return to failed steps.
  - P1 · clickable/non-linear steps (`onStepChange`, steps as buttons, revisit completed) · MUI nonLinear + StepButton, Carbon ProgressIndicator onChange, Ant onChange · today it's a static `<ol>` with no hover or focus states.
  - P2 · optional step marker ("Optional") · MUI optional, Carbon secondaryLabel.
  - P2 · disabled step · Carbon, Ant.
  - P2 · per-step custom icon · MUI StepIcon, Ant icon.
  - P2 · in-progress/loading step (Spinner in the mark) · Ant status=process, Fluent.
  - P2 · label placement (below vs beside) and compact "dot" variant · MUI alternativeLabel, Ant progressDot, Carbon vertical.
  - P2 · mobile stepper ("Step 2 of 5" with a progress bar) · MUI MobileStepper, HIG · horizontal labels don't fit phones.
  - P2 · skipped step state · MUI completed=false skip.
  - P2 · vertical with content under the active step · MUI vertical StepContent · may belong to Wizard, so document the split.
  - P3 · sizes sm/md · Ant small.
- matrix gaps: no STATE_ROWS row (done, current, upcoming, vertical); no focus or hover because steps aren't interactive.

### Accordion
- has: Radix Accordion; `type` single (collapsible) | multiple; `defaultValue`; `headingLevel` 2-4; disabled item; open/closed; chevron; focus-visible.
- missing:
  - P1 · controlled `value`/`onValueChange` · Radix, MUI, Ant, Chakra · only `defaultValue` is exposed, so you can't open a section from a link or a validation error.
  - P2 · non-collapsible single (always one open) · Radix collapsible=false, Ant (accordion without collapse) · today it's hard-coded `collapsible: true`.
  - P2 · leading icon, trailing meta/badge/actions in the header (e.g. "3 errors" with a glyph) · Ant extra, Fluent, Carbon · settings and FAQ counts.
  - P2 · variants: separated cards vs flush/divided list vs borderless · Ant ghost/bordered, Chakra, MUI (Paper vs disableGutters), Carbon flush.
  - P2 · chevron position start/end · Carbon align start, Ant expandIconPosition, Fluent.
  - P2 · sizes/density · Carbon sm/md/lg, Fluent.
  - P2 · lazy/unmount content (`forceMount` vs destroy on close) · Radix forceMount, Ant destroyInactivePanel.
  - P2 · hover style on the header · CSS has none.
  - P2 · `prefers-reduced-motion` for the height animation · check the global motion layer.
  - P3 · expand-all / collapse-all control · Carbon, common pattern.
  - P3 · Ant-style `collapsible="header"|"icon"` (only the icon toggles) · Ant.
  - Gap: no `@media (forced-colors)`.
- matrix gaps: no STATE_ROWS row (open, closed, disabled); `headingLevel` and `type="multiple"` have no examples in the matrix.

### TableOfContents
- has: items with level 2|3 (`.sub` indent); `track` (IntersectionObserver scroll-spy, aria-current location); hover, focus-visible; forced-colors.
- missing:
  - P2 · level-4 depth / nested collapse for long documents · Fluent (n/a), Docusaurus/MUI docs, Carbon (n/a) · the `level` type caps at 3.
  - P2 · moving active indicator (a rail with a sliding marker) and a progress style · MUI docs, Stripe/Docs patterns, Apple developer docs · Pane's motion language would suit it.
  - P2 · mobile: collapses into a "On this page" disclosure or Menu at the top · MUI docs, Docusaurus · a right rail disappears on phones.
  - P2 · scroll offset for sticky headers (`offset` prop) · Ant Anchor targetOffset.
  - P2 · `onNavigate`/smooth scroll respecting reduced motion · Ant Anchor.
  - P3 · horizontal anchor bar variant · Ant Anchor direction=horizontal.
  - P3 · sticky built in (`affix`) · Ant Anchor affix.
- matrix gaps: no STATE_ROWS row (current location, sub-level, hover).

---

### Top P1 across group B
1. Listbox data shape: groups/headers, icon/avatar slots, virtualisation (VirtualList). Inherited by Select, Combobox, MultiSelect, TransferList.
2. Combobox/Autocomplete: async search (`loading`, `onInputChange`, custom/disabled filter, aria-busy).
3. Combobox/MultiSelect: clearable / clear-all.
4. MultiSelect: maxTagCount "+N more" collapse.
5. Select: option groups and separators; option icon and description (align `SelectOption` with `ListboxOption`).
6. Menu/ContextMenu: submenus.
7. Menu/ContextMenu: checkbox and radio items with indicators.
8. Menu/ContextMenu: group labels.
9. Tabs: overflow (scroll buttons or a "More" menu).
10. Tabs: underline/line variant for page-level tabs (and a doc on Tabs vs SegmentedControl).
11. Tabs: vertical orientation styling, and disabled-tab styling (Radix sets the attributes, CSS ignores them).
12. Sidebar: collapsed icon rail with tooltips.
13. Sidebar: nested expandable items.
14. Sidebar/Navbar/NavigationMenu: mobile off-canvas collapse into a Drawer/Sheet.
15. Breadcrumb: collapse with an ellipsis menu.
16. Pagination: page-size selector and range label ("1–25 of 312").
17. Stepper: error step (glyph and word).
18. Stepper: clickable non-linear steps (`onStepChange`).
19. Accordion: controlled `value`/`onValueChange`.
20. Chip: icon/avatar slot, and a hover style.
21. Rating: hover preview.
22. RadioCards: media/icon/price slot.
23. SegmentedControl: icon-only and icon + label segments.
24. TransferList: per-list search, and select-all with counts.
25. Matrix: add STATE_ROWS rows for Menu, ContextMenu, TransferList, Tabs, Navbar, NavigationMenu, Sidebar, BottomNav, Breadcrumb, Pagination, Stepper, Accordion, TOC (13 components that have none today).
