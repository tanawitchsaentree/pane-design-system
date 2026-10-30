# Pane audit, group A: actions, form scaffolding, fields, choices, pickers

Sources read: `apps/docs/src/book/meta.json` (props), `packages/react/src/components/<Name>/<Name>.module.css` (styled states), `apps/docs/src/book/states.tsx` (STATE_ROWS). The `text()` helper gives Input, Textarea, PasswordInput, SearchInput, NumberInput, DatePicker, TimePicker and PinInput the cells default / filled / disabled / invalid / readonly / required. The gate forces hover and focus, so they are not cells.
Refs: MUI (incl. MUI X), Carbon, Ant, HIG, Radix/shadcn, Chakra (incl. Ark), Fluent 2.
Group-wide findings, repeated per component where they apply: (a) no component CSS styles `[aria-disabled='true']`, so "disabled but focusable" looks fully enabled. Button and IconButton set aria-disabled while loading. (b) Checkbox, Radio and Switch have no `:hover`. (c) No local `prefers-reduced-motion` in any group-A CSS, so spinners and the radio dot-in rely on global motion tokens (verify). (d) Nothing in the group has a warning or success status, a skeleton, or one size scale shared across fields.

### Button
- has: variant light / accent / glass / ghost / danger; size sm / md / lg; `icon`, `iconEnd`, `loading` (aria-busy + aria-disabled), `fullWidth`, native disabled. CSS: hover, active, focus-visible, disabled, forced-colors, .loading spinner.
- missing:
  - P1 · toggle / pressed state (`pressed`, aria-pressed, selected look) · MUI ToggleButton, Fluent ToggleButton, Radix/shadcn Toggle, HIG toggle buttons · bold/align/mute in toolbars; needs a non-hue "on" look (glass filled + inset), not colour alone
  - P1 · ButtonGroup: attached (shared edges) and spaced, horizontal / vertical, size and variant passed down · MUI ButtonGroup, Ant Space.Compact, Carbon ButtonSet, Chakra ButtonGroup, Fluent · footers, pagers, segmented actions; use logical edge radii so RTL works
  - P1 · SplitButton (main action + chevron menu, two focus stops) · Fluent SplitButton, Ant Dropdown.Button, Carbon ComboButton, MUI split pattern, HIG pull-down · "Save / Save as…", "Merge / Squash"
  - P1 · MenuButton: trigger with chevron, aria-haspopup / aria-expanded, open state style · Fluent MenuButton, Carbon MenuButton, Chakra MenuButton, HIG pop-up button · Pane has Menu but no styled trigger with an expanded state
  - P1 · render as link (`href` or `asChild` / polymorphic) · MUI component/href, Radix asChild, Ant href, Carbon href, Chakra as · "Get started" CTAs that navigate; today it is either a Link that looks wrong or a button inside an anchor
  - P2 · disabled-but-focusable (`disabledFocusable`, styled aria-disabled) · Fluent disabledFocusable, Carbon (tooltip on disabled), HIG · lets a tooltip explain why it is off; CSS has no aria-disabled selector
  - P2 · loading options: loadingText, loadingPosition start/end/center, delayed spinner · MUI loadingPosition / loadingIndicator, Chakra loadingText, Ant loading.delay · keeps the label width and says what is happening in words
  - P2 · transient success / "done" state after async (Saved ✓) · Carbon InlineLoading finished, HIG · glyph + word fits Pane's status rule
  - P2 · danger at lower emphasis (danger-ghost / danger-glass) · Carbon danger tertiary / ghost, Ant danger + type, Fluent · delete in table rows and menus without a loud solid
  - P2 · shape: pill / rounded / square · Ant shape round / circle, Fluent shape circular / rounded / square, HIG capsule · Pane has one corner, so check whether glass needs a capsule
  - P2 · Toolbar composition (roving tabindex, grouped buttons, overflow) · Radix Toolbar, Fluent Toolbar, Carbon · ghost buttons already aimed at toolbars, but there is no container
  - P2 · CopyButton (copies, then shows a "Copied" state with a word) · Carbon CopyButton, Chakra Clipboard, Mantine · code blocks, API keys
  - P3 · xs / xl sizes, density · Carbon xs–2xl, Ant small / middle / large · hero CTA or dense table; keep a 44px hit area
  - P3 · trailing slots: keyboard-shortcut hint (Kbd) and count badge · HIG, Fluent, Ant Badge on Button · "Inbox 3", "⌘S"
  - P3 · hold-to-confirm / press-and-hold destructive · HIG patterns · irreversible actions
  - P3 · stacked ButtonSet on narrow viewports (full-width, reversed order) · Carbon ButtonSet stacked, HIG sheets · mobile dialog footers
- matrix gaps: the row has default / disabled / loading for a single variant only. Missing cells: the 5 variants × states (danger disabled, ghost loading), sizes sm / lg, `icon`, `iconEnd`, `fullWidth`. aria-disabled is not styled even though `loading` sets it. No local reduced-motion rule for the spinner.

### IconButton
- has: variant glass / ghost / loud; size sm / md; `loading`; required `aria-label`. CSS: hover, active, focus-visible, disabled, forced-colors, spinner.
- missing:
  - P1 · toggle / pressed (aria-pressed, with a separate "on" icon) · MUI ToggleButton, Fluent ToggleButton, Radix Toggle, HIG · favourite, bookmark, mute, pin
  - P2 · built-in tooltip from aria-label (visible name on hover / focus) · Carbon IconButton label tooltip, Fluent, HIG help tags · icon-only controls need the word visible, which fits Pane's no-colour-alone rule
  - P2 · danger variant · Carbon ghost danger, Ant danger, Fluent · trash icon in rows
  - P2 · lg size · MUI large, Carbon lg, Fluent large · toolbars on touch and media players
  - P2 · badge / dot indicator slot · MUI Badge, HIG, Fluent CounterBadge · notifications bell
  - P2 · as link / asChild · MUI, Radix, Chakra · icon links in nav
  - P2 · expanded state when it triggers a menu (aria-expanded style) · Fluent MenuButton icon, Carbon OverflowMenu · the "…" overflow trigger
  - P3 · shape circle vs rounded square · Ant shape, Fluent shape · pairs with avatar rows
- matrix gaps: `loud` variant and size `sm` not in matrix; aria-disabled not styled (set while loading).

### FAB
- has: `icon`, `label`, `extended`, position fixed / contained. CSS: active, focus-visible, disabled, forced-colors.
- missing:
  - P2 · sizes small / large · MUI size, M3 small / large FAB · dense mobile screens
  - P2 · emphasis levels (loud / glass / tonal) · M3 primary / secondary / surface, MUI color · on busy photo backdrops a glass FAB may be enough
  - P2 · SpeedDial / FAB menu (expands into actions) · MUI SpeedDial, Ant FloatButton.Group, M3 FAB menu · "new: photo / note / album"
  - P2 · placement end / start / center, offset above BottomNav or Snackbar · Ant FloatButton placement, MUI, M3 · must flip with RTL through logical insets
  - P2 · shrink extended → icon on scroll, hide on scroll · M3 extended FAB · frees space on long feeds
  - P2 · loading state · Ant FloatButton (via Button), MUI · async create
  - P3 · back-to-top FAB · Ant FloatButton.BackTop · long docs and feeds
  - P3 · badge on FAB · Ant FloatButton badge · unread count
- matrix gaps: CSS has no `:hover`; `extended` and `contained` are not in matrix (only default / disabled).

### Label
- has: `required` (adds the word "(required)"). CSS: root, required.
- missing:
  - P2 · optional marker ("(optional)") as the alternative convention · Ant requiredMark="optional", Carbon guidance, GOV-style forms, HIG · forms where most fields are required
  - P2 · disabled tone · MUI FormLabel disabled, Fluent Label disabled · matches the dimmed control
  - P2 · size tied to field size (sm) · Fluent Label size, Ant Form size · sm inputs with full-size labels look off
  - P3 · info tooltip slot after text · Carbon label tooltip, Ant Form.Item tooltip · "What's this?" help
  - P3 · label-end action slot ("Forgot password?") · common product pattern, Fluent Field · sits on the same line as the label
- matrix gaps: no row of its own; required only appears through FormField text rows; disabled label tone not specified.

### HelperText
- has: tone help / error. CSS: forced-colors only.
- missing:
  - P1 · warning tone (glyph + word "Warning") · Carbon warn / warnText, Ant validateStatus warning, Fluent validationState warning · "this will notify 2,000 people", non-blocking
  - P2 · success / valid tone (glyph + word) · Ant success, Fluent success, Carbon (valid icon) · "Username available"
  - P2 · counter slot on the trailing side ("42 / 280") · MUI pattern, Ant showCount, Carbon enableCounter · see FormField
  - P3 · disabled tone · MUI FormHelperText disabled · dims with field
  - P3 · live-region policy (error announced politely once) · Fluent Field, Carbon · verify the error text is announced on change
- matrix gaps: no row; `error` tone only seen inside FormField cells; forced-colors is the only styled state.

### FormField
- has: `label`, `help`, `error`, `required`, `disabled`, useField context.
- missing:
  - P1 · character counter / maxLength wiring (counter shown and announced) · Carbon enableCounter / maxCount, Ant showCount, MUI pattern, Chakra · bios, tweets, SMS
  - P2 · warning / success status, beyond only error · Ant validateStatus, Fluent validationState, Carbon warn · non-blocking advice
  - P2 · validating / pending state (spinner + "Checking…") · Ant hasFeedback validating · async username or VAT checks
  - P2 · horizontal / inline orientation (label beside control) · Ant Form layout horizontal / inline, Fluent Field orientation, HIG settings rows · settings pages, dense admin forms
  - P2 · readOnly passed through context · Chakra FormControl isReadOnly · today each control is set by hand
  - P2 · size passed through context (sm / md) · Ant Form size, Fluent Field size · one switch per form
  - P2 · optional marker and label-end action slot · Ant requiredMark, Fluent Field · see Label
  - P3 · floating label · MUI outlined / filled, Carbon fluid · weaker a11y; only if a compact glass card needs it
- matrix gaps: no row of its own; required / error / disabled are shown only indirectly through text rows; no help-and-error-together cell.

### Fieldset
- has: `legend`, `help`. CSS: 5 lines.
- missing:
  - P1 · group error / invalid message ("Choose at least one") · MUI FormControl error + FormHelperText, Fluent Field around group, Ant Form.Item, Carbon CheckboxGroup invalid · checkbox groups have no other way to show an error
  - P2 · `disabled` for the whole group (native fieldset disabled) · Chakra, native, MUI FormControl disabled · read-only sections
  - P2 · `required` on group · MUI, Ant · consent groups
  - P2 · orientation horizontal / inline children · MUI FormGroup row, Ant, Fluent · short option sets
  - P3 · visually hidden legend, legend size · Carbon, Fluent · when a heading already labels it
  - P3 · collapsible fieldset · Ant Collapse in forms · long forms
- matrix gaps: no row; CSS has no `:disabled` for the group.

### Input
- has: size sm / md, `invalid`, native readOnly / disabled / placeholder. CSS: hover, focus-visible, disabled, read-only, placeholder, aria-invalid, glass-card variant, forced-colors.
- missing:
  - P1 · clearable (× button, Escape clears, focus returns) · Ant allowClear, MUI X / Autocomplete clear, Chakra, Mantine · filters, search-like fields; SearchInput has it, Input does not
  - P1 · character counter / maxLength · Ant showCount, Carbon enableCounter / maxCount, MUI · ties to FormField
  - P2 · prefix / suffix text inside the field ("$", "kg", ".com") · Ant prefix / suffix, MUI InputAdornment, Chakra InputElement · covered by InputGroup start / end, so document the link
  - P2 · lg size · Ant large, Carbon lg, Fluent large · onboarding and hero forms
  - P2 · warning / success status · Ant status, Carbon warn, Fluent validationState · see HelperText
  - P2 · validating / loading end adornment · Ant hasFeedback, MUI · async checks
  - P2 · appearance: quiet / borderless / underline (for inline table edit) · MUI standard / filled, Fluent underline / filled, Ant variant borderless / underlined · glass-on-glass inside cells
  - P2 · autofill styling (`:autofill` / `:-webkit-autofill`) · MUI, Carbon fix the yellow tint · browser fill breaks the glass look; no rule in CSS
  - P3 · input masks / formatted entry (phone, card, IBAN) · MUI via imask, Ant (third-party) · payments
  - P3 · skeleton · Carbon TextInputSkeleton, MUI Skeleton · loading forms
  - P3 · `dir="auto"` for user content, and number / email fields LTR inside RTL · Fluent, Carbon RTL guidance · mixed-script data
- matrix gaps: size `sm` not in matrix; no autofill rule; no warning / success.

### Textarea
- has: `invalid`, native props. CSS: hover, focus-visible, disabled, placeholder, aria-invalid, glass, forced-colors.
- missing:
  - P1 · auto-resize with minRows / maxRows · MUI multiline minRows / maxRows, Ant autoSize, Chakra (autosize), Fluent · chat and comment boxes; CSS `field-sizing: content` plus max-block-size
  - P1 · character counter / maxLength · Ant showCount, Carbon enableCounter, MUI · reviews, bios
  - P2 · resize control none / vertical / both · Fluent resize, native · fixed layouts
  - P2 · size sm / md parity with Input · Fluent size, Ant · dense forms
  - P2 · warning / success status · Ant, Carbon, Fluent
  - P3 · clearable · Ant allowClear
  - P3 · skeleton · Carbon TextAreaSkeleton
- matrix gaps: matrix has a `readonly` cell but Textarea CSS has no `:read-only` rule (Input has one), so read-only looks editable. No size prop.

### InputGroup
- has: `start`, `end` slots. CSS: focus-within, disabled, aria-invalid, glass, forced-colors.
- missing:
  - P2 · outer addon (attached segment: "https://", a currency Select, a Button) vs inner adornment · Ant addonBefore / After vs prefix / suffix, Chakra InputAddon vs InputElement, MUI · URL and currency fields
  - P2 · attached Input + Button compound (Subscribe, Copy) · Ant Space.Compact, Chakra · newsletter, invite link
  - P2 · interactive end slot rules (focus order, 44px hit area, clear / copy / reveal) · MUI InputAdornment position end, Ant · document how a button in `end` behaves
  - P2 · size passed through (sm) · Ant, Chakra · matches Input sm
- matrix gaps: no row; disabled / invalid are styled but not shown.

### PinInput
- has: `length`, numeric / alphanumeric, `invalid`, `disabled`, `readOnly`, `onComplete`, paste handling, inputMode.
- missing:
  - P1 · `autoComplete="one-time-code"` (iOS / Android SMS autofill), WebOTP · Chakra PinInput otp, HIG one-time code autofill, Ant Input.OTP · without it SMS codes won't autofill; no match in source
  - P2 · mask / secret (dots) · Chakra mask, Ant Input.OTP mask · PINs, not OTPs
  - P2 · group separator (123–456) · shadcn InputOTPSeparator, Mantine · readability for 6+ digits
  - P2 · per-cell placeholder glyph · Chakra placeholder · shows how many digits remain
  - P2 · success / verified state · product pattern (Ant status) · pair with OTPFlow
  - P3 · size · Chakra, Ant size
- matrix gaps: no "partially filled" or "complete" cell; invalid only via FormField.

### Checkbox
- has: `label`, `description`, checked true / false / indeterminate, `disabled`, `invalid`, `required`. CSS: active, focus-visible, disabled, aria-invalid, data-state checked / indeterminate, forced-colors.
- missing:
  - P2 · CheckboxGroup (value array) + select-all parent driving indeterminate · Ant Checkbox.Group, Chakra CheckboxGroup, MUI pattern, Fluent · table bulk select and permission lists; workaroundable with Fieldset
  - P2 · card / tile checkbox · Carbon SelectableTile, Chakra CheckboxCard · RadioCards exists only for single choice
  - P2 · readOnly · Carbon readOnly, Chakra isReadOnly · review screens
  - P2 · size sm / lg · MUI size, Fluent large, Chakra · dense tables vs onboarding
  - P2 · label position start / end · Fluent labelPosition, MUI labelPlacement · settings rows
  - P2 · hover state · all refs · CSS has no `:hover`
  - P3 · warning state · Carbon warn
- matrix gaps: `required` has no cell; no `:hover`; no readOnly.

### Radio
- has: RadioGroup (`label`, `help`, `value`, `invalid`, `disabled`, `required`), Radio (`label`, `description`, `disabled`). CSS: active, focus-visible, disabled, aria-invalid, forced-colors; dot via Indicator.
- missing:
  - P2 · orientation horizontal · MUI row, Carbon orientation, Fluent layout horizontal, Ant · short option sets
  - P2 · readOnly · Carbon readOnly, Chakra · review screens
  - P2 · size sm / lg · MUI, Fluent, Chakra · density
  - P2 · hover state · all refs · CSS has no `:hover`
  - P3 · button-style radio (Ant Radio.Button) · covered by SegmentedControl; card style covered by RadioCards
  - P3 · label position start · Fluent, MUI
- matrix gaps: `required` and group `help` have no cell; no `:hover`.

### Switch
- has: `label`, `description`, `checked`, `invalid`, `disabled`. CSS: active, focus-visible, disabled, aria-invalid, data-state checked, forced-colors.
- missing:
  - P2 · loading / pending (async setting save) · Ant Switch loading · toggles that call the server
  - P2 · visible On / Off words or glyphs in the track · Carbon Toggle labelA / labelB, HIG "On/Off labels" accessibility setting, Ant checkedChildren · fits Pane's no-colour-alone rule
  - P2 · size sm · MUI small, Ant small, Chakra, Fluent · dense settings lists
  - P2 · label position start / end, settings-row layout · Fluent labelPosition, HIG · iOS-style rows put the switch at the end
  - P2 · readOnly · Carbon Toggle readOnly
  - P2 · hover state · CSS has no `:hover`
  - P3 · required · Fluent, Ant (rare: consent)
- matrix gaps: no `:hover`; no loading.

### Slider
- has: `label`, `value`, `min`, `max`, `step`, `format`, variant channel / fill, `disabled`, aria-valuetext. CSS: hover, active, focus-visible, focus-within, data-disabled, forced-colors.
- missing:
  - P2 · marks / ticks with labels, snap to marks · MUI marks (step=null), Ant marks, Chakra SliderMark, HIG tick marks · price tiers, ratings
  - P2 · value bubble while dragging · MUI valueLabelDisplay, Ant tooltip · precise values
  - P2 · paired number input · Carbon Slider (built-in input) · exact entry and a11y
  - P2 · onValueCommit / change end · MUI onChangeCommitted, Radix onValueCommit, Ant onChangeComplete · avoids a network call on every tick
  - P2 · vertical orientation · MUI, Ant vertical, Radix, Fluent vertical · volume and EQ
  - P2 · invalid / warn and readOnly · Carbon invalid / warn / readOnly · form validation
  - P2 · size sm · MUI small, Fluent small · toolbars
  - P3 · min / max end labels · Carbon · range context
  - P3 · inverted · Radix inverted, MUI track inverted · verify RTL flips direction
- matrix gaps: variant `fill` not in matrix (only default / disabled); `format` output not shown.

### PasswordInput
- has: `autoComplete` current / new password, `showLabel` (reveal button), `invalid`. CSS: .eye only.
- missing:
  - P2 · strength meter / rules checklist for new-password · Mantine, HIG password rules, product pattern · sign-up; Pane has Meter, so add the wiring and the words
  - P2 · controlled visibility (`visible`, `onVisibleChange`) · Ant visibilityToggle object · reveal-all on confirm fields
  - P2 · caps-lock warning (glyph + word) · HIG (macOS shows caps-lock in password fields) · common login failure
  - P2 · size sm passthrough · Ant, Carbon · dense auth forms
  - P3 · disable reveal toggle · Ant visibilityToggle=false · policy-driven
- matrix gaps: the "revealed" state is not in matrix; eye button states come from elsewhere (verify focus / hover).

### SearchInput
- has: `value`, `onSearch`, clear button (`clearLabel`), Escape clears, Enter submits, `invalid`.
- missing:
  - P2 · searching / loading state · Ant Input.Search loading, Fluent SearchBox · results pending
  - P2 · expandable search (icon → field) · Carbon ExpandableSearch, HIG toolbar search · navbars
  - P2 · size sm / lg · Carbon sm / md / lg, Ant · toolbar vs hero
  - P2 · explicit submit button variant · Ant enterButton · hero search
  - P3 · shortcut hint (⌘K / "/") · Fluent, product pattern · use Kbd
  - P3 · scope filter inside field · Carbon, Ant addonBefore · "in: Prints"
  - P3 · debounce option for onValueChange · Ant, Fluent (app-level) · live search
- matrix gaps: no loading; CSS only 4 lines (inherits Input).

### NumberInput
- has: `value` (null allowed), `min`, `max`, `step`, `unit`, `label`, `invalid`; arrows / PageUp / Home keys, inputMode, aria-valuetext.
- missing:
  - P1 · visible stepper − / + buttons (44px) · Carbon NumberInput steppers, Ant InputNumber controls, Chakra NumberIncrementStepper, Fluent SpinButton, HIG Stepper, MUI Base NumberInput · touch users can't press arrow keys; quantities in carts
  - P2 · locale formatting / currency / percent (Intl.NumberFormat), parser · Ant formatter / parser, Chakra format, Fluent displayValue · prices; Thai and other locales
  - P2 · precision / decimals · Ant precision, Chakra precision · money
  - P2 · clamp-on-blur policy and out-of-range state · Chakra clampValueOnBlur / keepWithinRange, Carbon invalid on out-of-range · say why the value moved
  - P2 · stepper disabled at min / max · all with steppers · boundary feedback
  - P2 · size sm · Carbon, Ant · tables
  - P3 · Shift+Arrow large step, opt-in wheel · Fluent SpinButton, Chakra allowMouseWheel · power users
- matrix gaps: `unit` and the min / max boundary state not shown.

### RangeSlider
- has: `label`, `value`, `min`, `max`, `step`, `minGap`, `format`, `disabled`. CSS: 3 lines (inherits Slider).
- missing:
  - P2 · marks / ticks, value bubbles, onValueCommit, vertical, invalid / readOnly · same refs as Slider · price filters
  - P2 · paired min / max number inputs · Carbon (two inputs), Ant · exact price entry
  - P2 · `variant` parity with Slider (fill) · Pane-internal · Slider has channel / fill, RangeSlider has no variant prop
  - P3 · draggable track (move both thumbs) · Ant range.draggableTrack · time windows
  - P3 · more than 2 thumbs · Radix, MUI · segment boundaries
- matrix gaps: `minGap` collision state not shown; only default / disabled.

### Editable
- has: `label`, `value`, `onSave`, `placeholder`, size body / title, `disabled`; Enter saves, Escape cancels. CSS: hover, focus-visible, disabled, pencil, placeholder.
- missing:
  - P2 · multiline (textarea) mode · Chakra EditableTextarea, Ant Typography editable · descriptions
  - P2 · explicit Save / Cancel controls · Chakra EditableControls, Ant editable icon · touch users can't press Enter / Escape
  - P2 · validation / invalid and saving (pending) state · Ark Editable, product pattern · async rename
  - P2 · activation mode (click / dblclick / focus) and submit-on-blur option · Ark Editable activationMode / submitMode · tables vs titles
  - P3 · maxLength counter · Ant editable.maxLength · titles
  - P3 · readOnly · Ark
- matrix gaps: the "editing" state is not in matrix; size `title` not shown; no invalid.

### FileUpload
- has: `label`, `accept`, `multiple`, `maxSize`, `files`, `onFilesChange`, `hint`, `name`, `disabled`, `invalid`; file list with remove, refused state. CSS: data-invalid, .refused.
- missing:
  - P1 · per-file status: uploading (progress) / done / error + retry / cancel · Ant Upload file.status + percent, Carbon FileUploaderItem status uploading / complete / edit, Chakra FileUpload · every real upload hits this; status in glyph + word
  - P2 · maxFiles limit · Ant maxCount, Chakra maxFiles · avatar = 1, gallery = 10
  - P2 · image thumbnails / picture-card list · Ant listType picture / picture-card, Chakra · galleries
  - P2 · custom validate fn (dimensions, duplicates) · Chakra validate, Ant beforeUpload · beyond type and size
  - P2 · single-file replace pattern (avatar) · Ant, product pattern · "Change photo"
  - P3 · directory upload · Ant directory
  - P3 · paste-to-upload, mobile `capture` · Chakra, native
- matrix gaps: CSS has no `:hover`, `:focus-visible`, `:disabled` or forced-colors of its own; "with files" and "refused" states are not in matrix.

### Dropzone
- has: `label`, `hint`, `accept`, `multiple`, `maxSize`, `onFiles`, `icon`, `disabled`, `invalid`. CSS: hover, focus-visible, disabled, aria-invalid, data-over, forced-colors.
- missing:
  - P2 · drag-reject state while dragging a wrong type (glyph + word) · react-dropzone isDragReject, Chakra FileUpload · tells users before they drop
  - P2 · uploading / progress inside the zone · Carbon FileUploaderDropContainer + items, Ant Upload.Dragger · same as FileUpload P1
  - P2 · full-window drop overlay · product pattern (Ant Dragger page-level), Fluent · drop anywhere on the page
  - P2 · maxFiles · Chakra, Ant
  - P3 · compact / inline size · Carbon, Ant · sidebars
- matrix gaps: drag-over (`data-over`) is styled but has no matrix cell.

### ColorPicker
- has: `label`, `swatches` (named), `value`, `custom` (hex Input with preview, invalid hex), `disabled`. CSS: active, focus-visible, data-disabled, data-state checked, forced-colors.
- missing:
  - P2 · full picker: 2D saturation / brightness area + hue slider · Ant ColorPicker, Chakra ColorPicker, Fluent ColorPicker, HIG color well · the colour is user content, so this fits Pane's "colour from content"
  - P2 · alpha channel · Ant, Chakra, HIG
  - P2 · format switch hex / rgb / hsl · Ant format, Chakra · design tools
  - P2 · eyedropper (EyeDropper API) · Chakra, HIG · pick from an image
  - P2 · popover / trigger mode (swatch button opens picker) · Ant trigger, Chakra, Fluent · inline takes too much space
  - P2 · `invalid` / required for the group · Ant, form parity · forms
  - P3 · recent / preset groups, "no colour" clear · Ant presets / allowClear
- matrix gaps: the selected swatch (data-state checked) and custom-hex-invalid have no cell; no `invalid` prop.

### OTPFlow
- has: `destination`, `length`, `onVerify` (sync / async), `onResend`, `resendAfter` countdown. CSS: lead, to, status, wrong, wait, resend.
- missing:
  - P1 · SMS / OS autofill (`one-time-code`, WebOTP) · HIG, Chakra otp, Ant Input.OTP · see PinInput
  - P2 · verifying (pending) state and success state with glyph + word · product pattern, Ant status · async verify feedback
  - P2 · locked / too many attempts and expired-code states · product pattern (Auth0, Clerk) · security
  - P2 · "Change number / email" action and channel switch (SMS / email / call) · product pattern · wrong destination
  - P3 · masked destination formatting per locale · product pattern
- matrix gaps: no row; wrong / wait / resend states are styled but not shown.

### Calendar
- has: mode single / range, `value`, `defaultMonth`, `min`, `max`, `isUnavailable`, `locale`, `weekStartsOn`, `label`; keyboard arrows / PageUp / Shift / Home. CSS: today, chosen, start / mid / end, off (unavailable), out (outside month), hover, focus-visible, aria-disabled, forced-colors.
- missing:
  - P2 · multi-month view for ranges · MUI X DateRangeCalendar, Ant RangePicker, react-day-picker numberOfMonths · booking flows
  - P2 · month / year views and quick jump · MUI X views, Ant picker month / year, Fluent · birthdays, far dates
  - P2 · range hover preview · MUI X, Ant · shows the range before the second click
  - P2 · day content slot (dots, prices, events) · MUI X slots.day, Ant cellRender · availability calendars
  - P2 · week numbers · MUI X displayWeekNumber, Fluent showWeekNumbers, Ant week picker · EU business use
  - P2 · multiple-dates mode · react-day-picker multiple, Chakra / Ark DatePicker multiple · shift planning
  - P2 · Buddhist / other calendar systems (th-TH-u-ca-buddhist) · Intl, MUI X adapters, Ant locale · Thai market shows BE years
  - P2 · loading state (skeleton days) · MUI X loading / renderLoading · async availability
  - P2 · range max / min length · MUI X, Ant disabledDate with range · "max 14 nights"
  - P3 · fixed weeks, hide outside days, read-only calendar · react-day-picker, MUI X readOnly
  - P3 · verify RTL arrow-key direction flips · HIG, Fluent · logical navigation
- matrix gaps: no row at all; today / range-mid / unavailable / outside-month are styled but not shown.

### DatePicker
- has: mode single / range, `value`, `placeholder`, `min`, `max`, `isUnavailable`, `locale`, `weekStartsOn`, `disabled`, `readOnly`, `invalid`; button trigger + popover Calendar. CSS: trigger, placeholder, aria-invalid, data-readonly.
- missing:
  - P1 · typed date entry (segments or text with a format) · MUI X DateField, Carbon DatePicker input, Ant, Fluent allowTextInput · birthdates years back; keyboard users and fast entry
  - P1 · clear button · Ant allowClear, MUI X clearable, Fluent · optional dates
  - P2 · presets / shortcuts (Today, Last 7 days, This month) · Ant presets, MUI X shortcuts · reporting filters
  - P2 · month / year / week / quarter pickers · Ant picker, MUI X views · billing periods
  - P2 · date-time combined · MUI X DateTimePicker, Ant showTime · scheduling
  - P2 · display `format` option · Ant format, MUI X format · regional forms
  - P2 · range as two fields (start / end) + two-month popover · Carbon range, MUI X multi-input · booking
  - P2 · mobile presentation (sheet / full-screen) · MUI X MobileDatePicker, HIG wheels / compact · 44px day cells in small popovers
  - P2 · size sm · Ant, Carbon sm / md / lg · filters bar
- matrix gaps: `mode="range"` and the open state are not in matrix; trigger hover / focus come from shared Select styles (verify).

### TimePicker
- has: `label`, `hideLabel`, `value` HH:MM, `step`, `min`, `max`, `locale`, `placeholder`, `disabled`, `readOnly`, `name`; renders a Select of slots. No own CSS.
- missing:
  - P2 · typed time entry · MUI X TimeField, Carbon TimePicker, Fluent TimePicker freeform · odd times outside the step
  - P2 · explicit 12 / 24h (`hourCycle`) · MUI X ampm, Ant use12Hours, Carbon AM / PM select · locale default is not always what the user wants
  - P2 · time zone display / select · Carbon TimePicker timezone, MUI X timezone · meetings across regions
  - P2 · seconds precision · Ant showSecond, MUI X views seconds · logs, media
  - P2 · `isUnavailable` for times (parity with DatePicker) · Ant disabledTime, MUI X shouldDisableTime · booked slots
  - P2 · `invalid` prop parity with siblings · Pane-internal · DatePicker has it, TimePicker relies on FormField only
  - P2 · time range (start–end with duration labels) · Fluent, product pattern (calendar apps) · appointments
  - P3 · clear button · Ant allowClear, MUI X
- matrix gaps: no `invalid` prop (matrix invalid comes only from the FormField error); states come from Select.

## Top P1 across group A
1. Button: toggle / pressed state (aria-pressed), also on IconButton
2. ButtonGroup (attached / spaced, orientation, passes size and variant down)
3. SplitButton (main action + menu)
4. MenuButton trigger with expanded state
5. Button / IconButton as link (`href` / `asChild`)
6. Input clearable (×, Escape)
7. Character counter / maxLength in FormField, Input and Textarea
8. Textarea auto-resize with minRows / maxRows
9. HelperText / FormField warning tone (glyph + word)
10. Fieldset group-level error message
11. NumberInput visible − / + steppers (44px)
12. FileUpload per-file uploading / progress / error + retry
13. PinInput + OTPFlow `autoComplete="one-time-code"` / WebOTP
14. DatePicker typed entry
15. DatePicker clear button
Mismatches worth fixing alongside: aria-disabled unstyled (Button / IconButton loading); Textarea readonly cell with no `:read-only` CSS; no `:hover` on Checkbox / Radio / Switch / FAB; FileUpload has no focus / hover / disabled / forced-colors CSS; Dropzone drag-over, Calendar, OTPFlow, ColorPicker selected, Editable editing, Slider fill: styled or real but absent from STATE_ROWS; Label / HelperText / FormField / Fieldset / InputGroup / Calendar / OTPFlow have no matrix row.
