## Group D: data display, charts, patterns, layouts

Sources read: `apps/docs/src/book/meta.json` (props), `packages/react/src/components/<Name>/<Name>.module.css` (styled states), `apps/docs/src/book/states.tsx` (STATE_ROWS). Refs: MUI(+X), Carbon, Ant, HIG, Radix/shadcn, Chakra, Fluent 2, AG Grid, Recharts/Nivo.
Shared chart frame (`chart/core.tsx`) already gives every chart: title + description, a static legend (2+ series), a table view toggle, data palette per series, keyboard focus and tooltip.
In group D, STATE_ROWS has rows only for Table, DataGrid, Scale, ConfidenceChip, NodeCard, NetworkGraph, SequenceDiagram, RadarChart, BarChart and RichTextEditor (Fields). The other 22 components have no matrix row.

### Stat
- has: label, value, change, direction up/down/flat, sentiment positive/negative/neutral (split from direction, so "cost went up" can be bad), caption
- missing:
  - P1 · loading / skeleton value · Carbon, Ant (Statistic loading), MUI X, Fluent · dashboards render before data; with no loading prop people put Skeleton in by hand and the label jumps
  - P1 · comparison period / baseline text ("vs last 30 days", previous value) · Carbon, Ant, Tremor-style KPIs · a delta with no period is unreadable; caption is free text, so add a structured `comparison` slot
  - P1 · inline sparkline / trend slot · Tremor, MUI X (SparkLineChart in cards), Fluent · the usual KPI tile; Sparkline exists, but Stat has no slot or layout for it
  - P2 · sizes (sm/md/lg hero) · Ant, Carbon, Chakra (StatGroup) · KPI rows vs hero numbers
  - P2 · value prefix/suffix + unit, precision/format fn, tabular numerals · Ant (prefix/suffix/precision), Chakra · currency, %, units without string concat
  - P2 · error / unavailable value ("—" + reason, retry) · Carbon · a failed metric must not show 0
  - P2 · StatGroup / row with dividers, equal-width, responsive wrap · Chakra, Ant · the KPI strip
  - P2 · stale / last-updated stamp · Carbon, Grafana-style · live metrics
  - P3 · countdown / animated count-up (reduced motion respected) · Ant (Countdown) · niche
  - P3 · info tooltip on label (definition of metric) · Carbon, Fluent · works around via composition
  - P3 · clickable / link stat (drill-down) with hover state · Tremor, Carbon · use Card wrapper today
- matrix gaps: no row at all; up/down/flat × positive/negative/neutral are 9 visible combos with no cell. CSS has `.positive .negative .down` only: no style for `flat` (arrow glyph?) or `neutral`, so check that flat shows a glyph and word, not just no arrow.

### Meter
- has: label, value, min, max, high (warning), critical, valueText; CSS `.warning .critical` with glyph + status word
- missing:
  - P1 · `low` / `optimum` direction (lower is better vs higher is better) · HTML meter, Carbon, Fluent · disk use is bad when high, battery bad when low; only "high" thresholds today
  - P2 · segmented / stacked meter (several parts of one total, e.g. storage by type) · Carbon (stacked meter chart), Apple storage bar, Ant · common settings pattern; series colours from D-031
  - P2 · sizes / thickness (sm/md) · Carbon, Fluent · Progress has sizes, Meter does not
  - P2 · circular / gauge form · MUI X Gauge, Ant (Progress dashboard), Nivo · dashboards
  - P2 · helper/caption line (e.g. "12 GB of 50 GB") separate from valueText · Carbon · common
  - P3 · tick marks / threshold markers drawn on track · Carbon, Grafana · shows where warning starts
  - P3 · loading/unknown state · Carbon · rarely needed
- matrix gaps: no row; default / warning / critical cells are missing even though CSS styles them.

### Scale
- has: value, steps, words, compare + compareLabel, higherIsBetter, bare; matrix default / compared above / compared below
- missing:
  - P2 · range value (min–max band, e.g. "Medium–Fast") · Nivo bullet, Carbon · estimates often come as a range; CSS has `.band` but no range prop
  - P2 · sizes / compact inline in table cell · Carbon · used inside DataGrid
  - P3 · vertical orientation · niche
  - P3 · unknown / not rated state · prevents a fake 0
- matrix gaps: no `bare` cell; no `higherIsBetter=false` cell (good/bad flips, CSS `.good .bad`).

### ConfidenceChip
- has: level, steps, words, label; matrix very low / medium / very high
- missing:
  - P2 · unknown / not assessed level · ML/AI UIs (Fluent Copilot patterns) · avoid forcing a level
  - P2 · with explanation popover ("why this confidence") · Fluent AI, HIG · the honest-AI job
  - P3 · size sm (in a table cell) · Carbon tags
- matrix gaps: none (levels covered); add `unknown` once it exists.

### Progress
- has: label, value, max, showValue, valueText, sizes sm/md, indeterminate (value omitted → CSS `.unknown`)
- missing:
  - P1 · circular / ring progress · MUI, Ant, Chakra, Fluent (Spinner w/ value), HIG · upload in an avatar, a card corner; Spinner covers only indeterminate
  - P1 · success / error end states (done with check, failed with reason + retry) · Carbon (ProgressBar status), Ant (status success/exception) · uploads fail; status needs glyph+word per Pane rules
  - P2 · buffer (secondary value) · MUI (variant buffer) · media/streaming
  - P2 · segmented / steps progress ("3 of 5") · Ant (steps), Carbon · onboarding; Stepper covers the labelled case
  - P2 · helper text / time remaining · Carbon (helperText) · uploads
  - P2 · label placement inline vs top, hidden label · Carbon (hideLabel), Ant · tight rows
  - P3 · lg size / thick track · Ant · niche
- matrix gaps: no row; determinate / indeterminate / sm / md cells missing though `.unknown .sm .md` are styled.

### DescriptionList
- has: items, layout stacked/inline, dividers
- missing:
  - P1 · multi-column grid (2–4 columns, responsive) · Ant Descriptions (column, responsive), Carbon · detail pages show 6–20 fields; one column wastes space
  - P2 · empty value placeholder ("—" + sr text "Not set") · Carbon, Ant · avoids blank holes
  - P2 · loading / skeleton values · Carbon · detail pages load
  - P2 · per-item actions (copy, edit inline) · Ant (extra), Carbon · composes with Editable
  - P2 · title + extra (section header with action) · Ant Descriptions · common
  - P2 · bordered / sizes (compact density) · Ant (bordered, size) · admin views
  - P3 · item span (one item across columns) · Ant · niche
- matrix gaps: no row; stacked / inline / dividers cells missing.

### List
- has: variant inset/plain, label, item title/description/leading/trailing/href/onClick/chevron; CSS hover + focus-visible
- missing:
  - P1 · selectable list (single/multi, checkbox or check mark, selected state) · MUI (ListItemButton selected), HIG, Fluent List · settings choosers, mail lists; Listbox covers single form choice but not rich rows
  - P1 · disabled item · MUI, HIG, Fluent · a row you can't open
  - P1 · secondary action separate from row press (trailing button/switch with its own target) · MUI (secondaryAction), HIG · nesting a button in a pressable row is an a11y trap; needs a pattern
  - P2 · dense / compact density · MUI (dense), Fluent · menus and side panels
  - P2 · section headers / grouped lists (sticky subheader) · MUI (ListSubheader), HIG (sections) · contacts, settings
  - P2 · nested / collapsible list · MUI (Collapse) · navigation; partly TreeView
  - P2 · swipe actions (delete/archive) · HIG, Fluent mobile · touch-first lists
  - P2 · loading / skeleton rows, empty state slot · Ant List (loading, locale.emptyText) · common
  - P2 · reorderable (drag handle, keyboard move) · HIG (edit mode), Ant (dnd) · settings order
  - P3 · avatar sizing / three-line items · MUI · leading slot covers it
  - P3 · infinite load / pagination footer · Ant · use Feed/VirtualList
- matrix gaps: no row; inset / plain / pressable / link / with chevron cells missing.

### Table
- has: caption + showCaption, columns (key, header, align start/end, sortable, render), rows, density comfortable/compact, controlled + default single sort, maxHeight (sticky head), empty, loading; matrix default/sorted/compact/empty/loading
- missing:
  - P1 · row selection (checkbox column, select all, indeterminate) · MUI, Carbon, Ant, shadcn · Pane puts it only in DataGrid; fine if docs say "need select → DataGrid" (covered under another name)
  - P1 · row actions (overflow menu per row, hover-revealed on desktop, always visible on touch) · Carbon, Ant, MUI X · every admin table; needs 44px target
  - P1 · error state with retry (distinct from empty) · Carbon, Fluent · empty and failed must read differently
  - P1 · pagination footer / composition with Pagination · Carbon, Ant, MUI · Pagination exists but no slot or recipe
  - P1 · responsive behaviour (horizontal scroll with shadow, or stack to cards on narrow) · Carbon, Ant (scroll.x), shadcn · phone widths
  - P2 · expandable rows (detail panel) · Ant (expandable), Carbon, MUI X · orders → line items
  - P2 · sticky first column · Carbon, Ant (fixed) · only DataGrid has stickyFirst
  - P2 · footer / totals row (tfoot) · Ant (summary), AG Grid · money tables
  - P2 · zebra / striped · Carbon (zebra), MUI, Chakra · long rows; tone only, no hue
  - P2 · truncation with tooltip + column width/min width + wrap control · Ant (ellipsis), Carbon · long text
  - P2 · align `center` + numeric column type (tabular numerals, end align by default) · MUI X (type number), Ant · only start/end today
  - P2 · multi-column sort · MUI X, AG Grid, Ant · rarer in plain Table
  - P2 · clickable rows (row as link) with hover + focus state · Ant (onRow), Carbon · common drill-down
  - P2 · column header tooltip / description · Carbon · explain metrics
  - P2 · toolbar slot (search, filter, batch actions bar when rows selected) · Carbon (TableToolbar, batch actions), MUI X · composition
  - P2 · density "spacious" / tall · Carbon (xs–xl), Fluent · reading tables
  - P3 · grouped column headers (colspan) · Ant, AG Grid · niche for basic Table
  - P3 · row span / merged cells · Ant · niche
  - P3 · column filter dropdown in header · Ant · DataGrid territory
- matrix gaps: no cell for showCaption=false or maxHeight (sticky head). Sorted cell shows descending only; ascending not shown. No hover-row cell (gate forces hover, fine).

### Timeline
- has: items (time, title, description, state done/current/upcoming), label; CSS `.current .upcoming`
- missing:
  - P1 · status per item beyond progress (success / warning / error / info with glyph + word) · Ant (color/dot), Carbon, MUI Lab · order tracking "delivery failed"; Pane rule: glyph + word
  - P2 · custom dot / icon per item · MUI Lab, Ant (dot) · event types
  - P2 · alternate / opposite content (time on the other side, left-right alternate) · MUI Lab (position, OppositeContent), Ant (mode alternate) · changelog layout; logical start/end
  - P2 · horizontal orientation · Ant (Steps), Carbon (ProgressIndicator) · shipping progress; overlaps Stepper
  - P2 · pending / loading last item ("more coming…") · Ant (pending) · live tracking
  - P2 · connector styles (dashed for upcoming, solid for done) · MUI Lab, Ant · already implied by state; check CSS
  - P2 · collapsible / "show more" for long histories · Ant, GitHub-style · audit logs
  - P3 · reverse order toggle · Ant (reverse)
  - P3 · actions / attachments per item · Carbon · compose in description
- matrix gaps: no row; done / current / upcoming cells missing though styled.

### EmptyState
- has: title, description, icon, actions, heading level 2–4, sizes sm/md
- missing:
  - P1 · kinds of empty: first use / no results (with clear filters) / error (with retry) / no permission / offline · Carbon (empty state patterns), Ant (Result), Fluent · different copy and action per cause; one `kind` with defaults
  - P2 · lg / page-level size · Ant Result, Carbon · full-page 404/500
  - P2 · illustration slot vs icon · Carbon, Ant · Pane has no hue, so keep monochrome glyph wells
  - P2 · inline / horizontal layout (in a table body, in a card row) · Carbon · tight areas
  - P3 · secondary link/help text · Carbon
- matrix gaps: no row; sm / md cells missing.

### DataGrid
- has: caption, columns (Table columns), rows, selectable + controlled selected (aria-multiselectable), defaultSort, stickyFirst, maxHeight, loading, empty, grid keyboard (arrows/Home); matrix default/selected/empty/loading
- missing:
  - P1 · pagination (client + server) + rows-per-page · MUI X, AG Grid, Carbon · grids beyond 100 rows
  - P1 · server-side mode (controlled sort/filter/page, onChange callbacks, loading overlay over stale rows) · MUI X, AG Grid · real backends; today only defaultSort
  - P1 · row actions column + batch action bar on selection · Carbon, MUI X · bulk delete/export
  - P1 · error state with retry · Carbon, MUI X (error overlay) · separate from empty
  - P1 · column resize + visibility toggle (columns menu) · MUI X, AG Grid · users hide columns daily
  - P2 · density (compact/comfortable/spacious) · MUI X, Carbon · Table has it, DataGrid has no prop or CSS
  - P2 · quick filter / per-column filter · MUI X, AG Grid, Ant · find rows
  - P2 · multi-sort, column reorder, pinned columns both sides · MUI X Pro, AG Grid
  - P2 · selection modes: single, disabled rows (not selectable), select all across pages · MUI X, AG Grid
  - P2 · expandable detail panel · MUI X Pro (detail panel), AG Grid (master/detail)
  - P2 · cell types (number, date, boolean, chip/status with glyph+word, link) with format · MUI X column types
  - P2 · footer (row count, totals/aggregates) · MUI X, AG Grid
  - P2 · export CSV / copy cells · MUI X, AG Grid
  - P3 · row reordering by drag · MUI X Pro
  - X2 roadmap (listed only): cell/row editing, row grouping, tree data, pivot, aggregation, virtualised rows+columns, range selection, clipboard paste, column groups, Excel export
- matrix gaps: no cell for stickyFirst; no "selected all / indeterminate header" cell; no disabled-row cell.

### TreeView
- has: label, nodes (id, label, icon, children), single selection (value/defaultValue/onValueChange), defaultExpanded, keyboard (arrows/Home), aria-expanded/selected
- missing:
  - P1 · controlled expanded (expanded + onExpandedChange) · MUI X, Ant, Carbon · expand to show a searched item; only defaultExpanded today
  - P1 · checkbox multi-select with tri-state parents · MUI X (checkboxSelection), Ant (checkable), Carbon · permissions trees, file pickers
  - P1 · lazy loading children (async, loading spinner per node, error per node) · Ant (loadData), MUI X (lazy loading) · file systems
  - P2 · disabled node · MUI X, Ant · locked items
  - P2 · drag & drop reorder/move (with keyboard alternative) · Ant (draggable), MUI X Pro · file managers
  - P2 · inline rename (compose with Editable) · MUI X (editing) · files
  - P2 · per-node actions (hover overflow menu, always visible on touch) · Ant (titleRender), VS Code · common
  - P2 · type-ahead search + filter/highlight matches · ARIA tree pattern, Ant (searchable) · long trees
  - P2 · density (compact) and guide lines (show line) · Ant (showLine), Fluent · code/file trees
  - P2 · empty state (no nodes) · Ant
  - P3 · virtualised large trees · Ant (virtual), MUI X Pro
  - P3 · multi-select without checkboxes (Ctrl/Shift) · MUI X (multiSelect)
- matrix gaps: no row; selected / expanded / collapsed cells missing.

### VirtualList
- has: label, items, renderItem, fixed rowHeight, blockSize, overscan, getKey
- missing:
  - P1 · variable / measured row heights · react-virtuoso, TanStack Virtual, MUI X · chat, cards; fixed height breaks real content
  - P2 · scrollToIndex / imperative API, initial index · react-window, Virtuoso
  - P2 · end reached / infinite load hook + loading row · Virtuoso, Ant · Feed overlaps; note which to use
  - P2 · empty + loading states · Ant List virtual
  - P2 · sticky group headers · Virtuoso (GroupedVirtuoso) · contacts
  - P3 · horizontal / grid virtualization · react-window
  - P3 · reverse (chat, bottom-anchored) · Virtuoso
- matrix gaps: no row (static list; fine, but no empty cell).

### BarChart
- has: label, description, categories, series, layout column/bar (horizontal), stacked, format, blockSize, legend, table view, tooltip, keyboard; matrix default/empty
- missing:
  - P1 · negative values with zero baseline · Recharts, Nivo, Carbon charts · P&L, deltas; check that min(0) handles it, add a cell
  - P1 · loading state (skeleton plot) and error state with retry · Carbon charts, MUI X (loading overlay) · dashboards
  - P1 · real empty / no-data message ("No sales in this range") · Carbon, MUI X (noData) · matrix cell exists but CSS has no empty style
  - P1 · legend toggling (hide/show series) · Recharts, Nivo, Carbon, MUI X · compare 2 of 6; legend is static
  - P2 · reference line / target band (goal, average) · Recharts (ReferenceLine/Area), MUI X, Nivo markers · "target 100"
  - P2 · percent-stacked (100%) · Carbon, Nivo · share over time
  - P2 · value labels on bars · Nivo, Carbon · small charts
  - P2 · axis config: axis title, tick format separate from tooltip format, log scale, fixed domain · Recharts, MUI X
  - P2 · bar click / selection (drill-down, onSelect) · Recharts, Nivo · like NetworkGraph onSelect
  - P2 · many series folded to Other (doc says fold yourself; no helper) · Carbon guidance · add `maxSeries` helper
  - P2 · single-series highlight one bar (others dimmed, `[data-dim]` exists) · Nivo, Carbon · "this month"
  - P3 · export PNG/SVG/CSV · Carbon toolbar, AG Charts · table view covers reading
  - P3 · brush / zoom for long categories · Recharts Brush · rare for bars
  - P3 · diverging / lollipop · Nivo · niche
- matrix gaps: no cell for layout="bar", stacked, multi-series legend, negative.

### LineChart
- has: label, description, points, series, area, format, labelEvery, blockSize, legend, table view, tooltip, keyboard; CSS `.line .area .dot`
- missing:
  - P1 · gaps / null values (connectNulls vs break) · Recharts, MUI X, Nivo · missing days are common; number[] can't express it
  - P1 · loading / empty / error states · Carbon, MUI X · no states at all, no matrix row
  - P1 · legend toggling · Recharts, Nivo, MUI X · as BarChart
  - P1 · reference line / band (target, threshold, "now") · Recharts, MUI X, Carbon (thresholds) · SLOs
  - P2 · time axis (real dates, uneven spacing) · MUI X, Recharts (scale time), Carbon · points are strings today
  - P2 · curve type: linear / smooth / step · Recharts, MUI X, Nivo · step for states, linear default
  - P2 · dashed series (forecast / previous period) · Recharts (strokeDasharray), Carbon · second cue beside colour (helps CVD)
  - P2 · markers on/off · MUI X (showMark), Nivo · dense data
  - P2 · stacked area · Recharts, Nivo · composition over time
  - P2 · annotations (event markers on x) · Carbon, AG Charts · releases, incidents
  - P2 · y-axis config: domain, log, dual axis · Recharts · rare dual axis P3
  - P2 · zoom / brush for long series · Recharts Brush, MUI X Pro zoom · metrics
  - P2 · crosshair shared tooltip across series · Recharts, MUI X (axis tooltip) · check current tooltip
  - P3 · export · Carbon
- matrix gaps: no row; area / multi-series cells missing.

### RadarChart
- has: label, description, axes, series, max, rings, format, legend, table view; matrix default/two series
- missing:
  - P2 · legend toggling / series focus · Nivo, Recharts
  - P2 · filled vs outline-only shapes, dot on/off · Nivo, Recharts · overlap readability with 3+ series
  - P2 · empty / loading states · Carbon
  - P3 · per-axis max / scale · Nivo
  - P3 · polygon vs circular grid · Nivo (gridShape)
- matrix gaps: no "empty" or "many series" cell.

### Sparkline
- has: label, values, blockSize, showLast
- missing:
  - P1 · area / bar variants · MUI X (SparkLineChart plotType bar, area), Tremor · bar sparklines for counts
  - P2 · reference / baseline line (zero, average, target) and min/max markers · MUI X, Tufte · read trend vs goal
  - P2 · tooltip on hover/focus (value at index) · MUI X (showTooltip, showHighlight)
  - P2 · width control / fill container + sizing in Table cell · MUI X · inside tables
  - P2 · empty / single-value state · avoids a broken line
  - P2 · trend tone (rising good vs bad) without hue: glyph + word only where shown · Pane rule; pairs with Stat
  - P3 · win/loss variant · Excel, Tremor
- matrix gaps: no row; showLast cell missing.

### Heatmap
- has: label, description, rows, columns, values, format, labelEvery, sequential ramp + scale legend, keyboard, `[data-on]` focused cell
- missing:
  - P1 · null / missing cells (distinct from 0, hatched or outlined) · Nivo, AG Charts · sensors/users with no data
  - P2 · diverging scale (two tones around a midpoint, e.g. –/+ change) · Nivo, Carbon · D-032 covers sequential only; needs a decision
  - P2 · calendar heatmap (GitHub contributions) · Nivo Calendar, Ant · very common job
  - P2 · cell labels (value printed in cell) · Nivo, Carbon · small matrices
  - P2 · fixed domain (min/max) so two heatmaps compare · Nivo · dashboards
  - P2 · loading / empty states · Carbon
  - P2 · cell click / selection callback · Nivo
  - P3 · row/column sorting, clustering · niche
- matrix gaps: no row; default / focused cell missing.

### NodeCard
- has: title, meta, icon, children, selected, dragging, collapsed + onToggle, onSelect, onMove, ports in/out; matrix default/selected/dragging/collapsed
- missing:
  - P1 · status (running / success / error / warning / disabled) with glyph + word · React Flow examples, n8n, Node-RED · workflow runs fail; core of a node editor
  - P2 · port labels / typed ports and connected vs free port state · React Flow (Handle), Rete · data pipelines
  - P2 · drop target / connect-hover state (valid vs invalid connection) · React Flow · while dragging edges
  - P2 · disabled / bypassed node · n8n, Unreal Blueprints · skip a step
  - P2 · toolbar / actions on select (delete, duplicate) · React Flow NodeToolbar
  - P2 · sizes / compact (title only) · Node-RED
  - P3 · resizable · React Flow NodeResizer
  - P3 · group/subflow container node · React Flow
- matrix gaps: no ports cell; no cell for selected+dragging.

### NetworkGraph
- has: label, description, nodes (id, label, group), edges (from, to, label, weight), sizes mini/full, onSelect, faded neighbours; matrix full/mini
- missing:
  - P2 · directed edges (arrowheads) · Nivo Network, Cytoscape, vis · dependency graphs; edges have from/to but no direction flag
  - P2 · zoom / pan / fit-to-view · Cytoscape, vis-network, React Flow · beyond ~30 nodes
  - P2 · node size by value (degree/weight) · Nivo · importance
  - P2 · layout choice (force / hierarchical / radial) · Cytoscape, ELK · trees of services
  - P2 · search / focus a node, controlled selection · Cytoscape
  - P2 · empty / loading states · Carbon
  - P2 · legend for groups (group number → name) · Nivo · group is an index only
  - P3 · edge styles (dashed for weak/optional) · vis · second cue beside weight
  - P3 · drag nodes to pin · vis-network
- matrix gaps: no "selected/faded" cell (`.faded .on` styled), no groups cell.

### SequenceDiagram
- has: label, actors, steps (from, to, label, kind message/reply/note, time), self-messages (`.self`); matrix message and reply / note
- missing:
  - P2 · async vs sync arrow, error/failed message (glyph + word) · Mermaid, PlantUML · timeouts, 500s
  - P2 · activation bars / lifelines with duration · Mermaid · who is busy
  - P2 · fragments (alt / opt / loop / par boxes) · UML, Mermaid · branches
  - P2 · highlighted / current step (for step-through playback) · Swimlanes.io · tutorials, traces
  - P3 · actor kinds (person, service, database glyph) · PlantUML
  - P3 · collapse long sequences · niche
- matrix gaps: no self-message cell; no time cell.

### Form
- has: onSubmit, errors, errorTitle (error summary with links, role=alert), actions, children
- missing:
  - P1 · submitting / pending state (disable submit, aria-busy, keep values) · Ant (Form + loading), Fluent, Carbon · double submits; AuthForm has `pending`, Form doesn't
  - P1 · success / saved confirmation pattern · Carbon (inline notification), HIG · "Saved" with glyph + word
  - P2 · layout: vertical / horizontal (label beside) / inline · Ant (layout), Carbon · admin forms
  - P2 · sections / Fieldset grouping with headings and description · Carbon, HIG (grouped forms) · Fieldset exists; doc recipe needed
  - P2 · dirty state + unsaved-changes guard · Ant (isFieldsTouched), Formik · leaving a form
  - P2 · sticky action bar for long forms · Carbon, Fluent · long settings
  - P2 · read-only / view mode of whole form · Ant (disabled form), Carbon · review step
  - P2 · required legend ("* required") / optional markers convention · Carbon, GOV.UK · copy consistency
  - P3 · size / density propagated to fields · Ant (size) · compact admin
  - P3 · autosave indicator · Notion-style
- matrix gaps: no row; error-summary cell missing.

### Wizard
- has: label, steps (label, description, content, async validate), onFinish, finishLabel, onCancel, step count
- missing:
  - P1 · error step / step with issues (marked in the step list with glyph + word) · Carbon (ProgressIndicator invalid), Ant Steps (status error), MUI Stepper · validation failing on a past step
  - P1 · step indicator (horizontal/vertical Stepper composed in) · MUI, Carbon, Ant · Stepper exists; Wizard only shows count
  - P1 · finishing / submitting state on last step · Ant, MUI · async finish
  - P2 · optional / skippable steps · MUI (optional), Carbon · "Skip for now"
  - P2 · non-linear (jump to completed steps) · MUI (nonLinear), Ant · edit earlier answers
  - P2 · save draft / resume later · Carbon, gov patterns · long applications
  - P2 · review / summary step pattern · Carbon, GOV.UK check answers
  - P2 · controlled step index (step + onStepChange) · MUI, Ant · URL-synced steps
  - P2 · cancel confirm when dirty · Carbon
  - P3 · full-page vs in-dialog layout variants · Carbon (FullPage / Modal wizard)
- matrix gaps: no row; first / middle / last / validating cells missing.

### AuthForm
- has: mode sign-in/sign-up/reset, onSubmit, errors, pending, title, description, passwordHint, onForgot, onSwitch, providers (social)
- missing:
  - P1 · MFA / one-time code step · Clerk, Auth0 UI, Supabase UI · OTPFlow exists; AuthForm has no handoff mode
  - P1 · global error (bad credentials, locked account, rate limited) separate from field errors · Clerk, Auth0 · "Email or password is wrong" is not a field error
  - P2 · magic link / passwordless mode and "check your email" sent state · Clerk, Supabase · common
  - P2 · reset confirmation (sent) + set-new-password mode · Auth0 · reset is two steps
  - P2 · remember me / stay signed in · Ant Pro login · common
  - P2 · terms/consent checkbox on sign-up · Clerk · legal
  - P2 · passkey sign-in button · Clerk, HIG (passkeys) · 2026 baseline
  - P2 · username or phone instead of email · Clerk · regional
  - P3 · layout variants (card vs split with media) · Ant Pro
- matrix gaps: no row; sign-in / sign-up / reset / pending / errors cells missing.

### CommandPalette
- has: commands (id, label, group, keywords, shortcut, icon), open/onOpenChange, hotkey, placeholder, empty text, groups, listbox keyboard
- missing:
  - P1 · async / loading results (search API) with loading state · cmdk, kbar, Raycast · search records not just commands
  - P1 · recents / suggested when query empty · Raycast, VS Code, Linear · the first thing users see
  - P2 · nested pages / sub-commands with back (Esc/Backspace) · cmdk (pages), kbar, Raycast · "Change theme → …"
  - P2 · description / secondary line per command, disabled command · cmdk, Fluent · explain or explain why not
  - P2 · match highlighting · VS Code, Raycast
  - P2 · onSelect per command documented (vs global) + keep open option · cmdk
  - P2 · error state (search failed) · Linear
  - P3 · footer hints customisable, mode prefixes (">" for actions) · VS Code
  - P3 · preview pane for the active item · Raycast
- matrix gaps: no row; empty / groups / active row cells missing.

### NotificationCenter
- has: notices (id, title, body, time, group, unread), onMarkAllRead, onOpenNotice, label, bell + badge, groups
- missing:
  - P1 · per-notice actions (mark read/unread, dismiss, inline primary action like "Approve") · Novu, Knock, Fluent, Carbon · notifications that ask for action
  - P1 · tabs / filter (All / Unread / Mentions) · Novu, GitHub, Linear · standard inbox
  - P1 · empty state ("You're all caught up") and loading / error · Novu, Knock · first-run
  - P2 · severity per notice (info/success/warning/error with glyph + word) · Carbon, Fluent · system alerts
  - P2 · avatar / actor leading per notice · GitHub, Novu · "Ana commented"
  - P2 · pagination / load more for history · Novu
  - P2 · settings link / preferences slot · Knock, Novu
  - P2 · badge cap (99+) and dot-only badge · MUI Badge · check Badge composition
  - P3 · snooze, archive · Linear, Gmail
- matrix gaps: no row; unread / read / empty cells missing.

### CoachMark
- has: children (anchor), open, title, description, step/total, onNext, onSkip, side top/right/bottom/left, preview
- missing:
  - P2 · onBack (previous step) · Ant Tour, Shepherd, Joyride · tours go both ways
  - P2 · spotlight / mask around target · Ant Tour (mask), Joyride · focus attention; glass dim fits Pane
  - P2 · media slot (image/video in card) · Ant Tour (cover)
  - P2 · Tour orchestrator (array of steps, persistence "seen") · Ant Tour, Shepherd · today each step is wired by hand
  - P2 · placement start/end alignment and auto-flip · Floating UI · near edges; side has 4 values only
  - P3 · beacon / hotspot pulse (soft motion) · Joyride
  - P3 · non-modal "tip" vs modal tour variant · HIG TipKit
- matrix gaps: no row; sides / step 1 of n / last step cells missing.

### KanbanBoard
- has: label, columns (id, title, cards[id, title, meta]), onChange, drag + keyboard move with live announcements, card count, held / over states
- missing:
  - P1 · add card / add column affordances · Trello, Jira, Linear · board without create is read-mostly
  - P1 · empty column state + drop target hint · Jira, Trello · `.hint` exists; check cell
  - P1 · card press / open details (onOpenCard) and card actions menu · Jira, Linear · core job
  - P2 · WIP limits (count vs limit, over-limit warning with glyph + word) · Jira, Azure Boards · lean teams
  - P2 · swimlanes (rows by assignee/priority) · Jira, Azure Boards · common in Jira
  - P2 · collapsed column · Jira, GitHub Projects · narrow boards
  - P2 · column reorder · Trello
  - P2 · card variants: compact, with avatar/labels/due date/status · Jira, Linear · meta is a free slot; document recipe
  - P2 · loading / skeleton columns · Linear
  - P2 · disabled drop (column refuses card, reason announced) · Jira workflows · transitions not allowed
  - P3 · multi-select drag · Linear
  - P3 · virtualised long columns · Linear
- matrix gaps: no row; held / over / empty column cells missing though styled.

### Feed
- has: label, items, renderItem, getLabel, getKey, onLoadMore, loading, hasMore, role=feed, end marker
- missing:
  - P1 · error on load-more with retry · Ant List, Twitter-style · flaky networks
  - P1 · empty state · Ant · first-run
  - P2 · new items available pill ("3 new posts", jump to top) · Twitter/X, Fluent · live feeds
  - P2 · initial skeleton items · Ant, MUI · first load
  - P2 · pull to refresh composition (PullToRefresh exists) · HIG · doc recipe
  - P2 · reverse / chat direction · chat UIs
  - P3 · virtualisation for very long feeds · Virtuoso
- matrix gaps: no row; loading / end / has more cells missing.

### AppShell
- has: header, sidebar, bottomNav, aside, children, label, skip link, sticky header, has-side/has-aside grid
- missing:
  - P1 · collapsible sidebar (rail / icons-only) + controlled open · MUI Drawer mini variant, Carbon UI Shell rail, Fluent Nav · everyday desktop apps
  - P1 · responsive sidebar → drawer on small screens with toggle · Carbon, MUI, shadcn Sidebar · phones
  - P2 · footer slot · Ant Layout · legal links
  - P2 · aside as overlay vs push, resizable panes · Fluent, VS Code · tool apps
  - P2 · header variants: transparent over content, hide on scroll · HIG, MUI AppBar · content apps
  - P2 · banner slot (system announcement above header) · Carbon · Banner exists; slot
  - P3 · full-bleed / no sidebar page mode documented · Carbon
- matrix gaps: no row (layout; fine), but no doc cell for with/without sidebar, aside, bottomNav.

### SettingsLayout
- has: title, description, groups (title, description), rows (label, description, control)
- missing:
  - P1 · side navigation of sections (master–detail, list → detail on mobile) · HIG Settings, Fluent, GitHub settings · real settings have 5–20 pages
  - P2 · row variants: navigational row (chevron to sub-page), destructive zone ("Danger zone"), read-only value · HIG, GitHub · common
  - P2 · save model: instant vs Save bar with dirty state · Carbon, GitHub · mixed patterns confuse
  - P2 · disabled row with reason (managed by admin / plan required) · Fluent, Google Workspace · no-permission state
  - P2 · search settings · macOS, VS Code
  - P2 · loading skeleton rows · Fluent
  - P3 · stacked control on narrow (control under label) · HIG · check CSS wraps
- matrix gaps: no row.

### RichTextEditor
- has: aria-label, defaultValue (HTML), onChange, placeholder, rows, disabled, readOnly (hides toolbar), invalid, toolbar bold/italic/link/bullet/ordered list; matrix default/filled/disabled/invalid/readonly/required via Fields
- missing:
  - P1 · controlled value · every ref (Tiptap/Lexical wrappers, Ant) · forms need reset and load
  - P1 · character / word count with limit · MUI, Ant (showCount), Carbon · comments, bios
  - P2 · more tools: headings, quote, code, strikethrough, underline, undo/redo · Tiptap, Lexical, Fluent · basic content editing
  - P2 · toolbar variants: fixed / floating bubble on selection / bottom (mobile) / minimal · Tiptap BubbleMenu, Notion, Slack · comment boxes vs documents
  - P2 · mentions (@) and slash commands (/) · Tiptap, Lexical, Slack, Notion · collaboration
  - P2 · image / file paste and upload · Tiptap · notes
  - P2 · output format (markdown / JSON as well as HTML) + sanitisation note · Tiptap, Lexical · security
  - P2 · auto-grow height (min/max rows) · Slack, MUI (multiline maxRows) · only rows today
  - P2 · submit on Enter (chat mode) · Slack
  - P3 · tables, code blocks with syntax · Tiptap
  - P3 · collaborative cursors · Tiptap/Yjs
- matrix gaps: Fields helper passes disabled/error to FormField only; confirm the cells actually reach the editor's own `disabled`/`invalid` props, else the disabled/invalid cells may show no change on the editor box (CSS has `.disabled`, check an invalid ring exists).

## Mismatches (prop vs matrix vs CSS)
- 22 of 32 group-D components have no STATE_ROWS row: Stat, Meter, Progress, DescriptionList, List, Timeline, EmptyState, TreeView, VirtualList, LineChart, Sparkline, Heatmap, Form, Wizard, AuthForm, CommandPalette, NotificationCenter, CoachMark, KanbanBoard, Feed, AppShell, SettingsLayout. Most have styled states (Meter warning/critical, Progress unknown, Timeline current/upcoming, Kanban held/over, NotificationCenter unread, CommandPalette empty) that no cell shows.
- BarChart `layout`, `stacked` have no cell; BarChart "empty" cell exists but CSS has no empty class (check that it shows a message, not an empty frame).
- Table `showCaption`, `maxHeight`; DataGrid `stickyFirst` have no cell.
- DataGrid reuses Table columns but has no `density` prop and no compact CSS, while Table does.
- Stat `direction="flat"` and `sentiment="neutral"` have no dedicated CSS; make sure flat still shows a glyph + word.
- Scale `bare`, `higherIsBetter=false` have CSS (`.bare .good .bad`) but no cell.
- Chart legend is static (`ul`), no toggle, while the docs say "fold to Other" with no helper.

## Top P1 across group D
1. DataGrid: pagination + server-side mode (controlled sort/filter/page)
2. DataGrid + Table: row actions and a batch action bar on selection
3. Table / DataGrid / charts / Feed: error state with retry, distinct from empty
4. Table: responsive behaviour (scroll shadow or stack) + Pagination composition
5. DataGrid: column visibility + resize
6. Charts (Bar/Line): loading, empty-message, error states; legend toggling
7. LineChart: null gaps, reference lines/bands
8. BarChart: negative values on a zero baseline
9. Sparkline: bar/area variants
10. Heatmap: missing-value cells distinct from 0
11. Stat: loading, comparison period, sparkline slot
12. Progress: circular form; success/error end states
13. Meter: low/optimum (lower-is-better) direction
14. List: selectable rows, disabled item, separate secondary action
15. TreeView: controlled expanded, checkbox tri-state, lazy loading
16. VirtualList: variable row heights
17. Timeline: per-item status (success/warning/error) with glyph + word
18. EmptyState: kinds (first use / no results / error / no permission / offline)
19. DescriptionList: multi-column responsive grid
20. Form: pending/submitting state + saved confirmation
21. Wizard: error steps, Stepper indicator, finishing state
22. AuthForm: MFA handoff (OTPFlow), global credential error
23. CommandPalette: async loading results, recents when empty
24. NotificationCenter: per-notice actions, tabs/filter, empty/loading
25. KanbanBoard: add card/column, empty column, open card; AppShell collapsible + responsive sidebar; SettingsLayout section nav; RichTextEditor controlled value + character count; NodeCard run status
