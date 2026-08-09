# Roadmap — released in usable layers, not one 103-component drop

Each tier below is a real, independently-publishable, independently-useful release — not a checkpoint on the way to v1.0. A consumer who only needs tier S should never have to wait for tier XL to exist. Component counts and wave groupings come from `docs/CATALOG.md`'s locked 10-wave catalog (103 components total, D-001 through D-024).

## S — v0.1 (current)

**39 components across Wave 1-4, plus 3 of Wave 5's 9 (Listbox, RadioCards, Rating built and QA-passed; Select in progress, not yet counted) + 4 pulled forward from Wave 7 (Card, Alert, Table basic, Stat) = 46/103.**

Layout primitives, core atoms, core form controls, every web overlay (Dialog, Drawer, Popover, Tooltip, Toast, Snackbar), and — pulled forward out of catalog order specifically because `examples/demo-app` hit the gap within one real page — Card, Alert, Table, and Stat. Two sharpest gaps that surfaced from that same page:

- **No `Card`** — closed. Built with the exact anatomy the demo app needed (header/body/footer, a clickable variant, a media slot), not a guess.
- **No `Select`** (rest of Wave 5) — `Listbox` still has to stand in for a closed dropdown in the demo app; this is visibly the wrong widget for that spot (an always-open list where a single collapsed control belongs). Still open — the next thing queued.

## M — v0.2

**+ the rest of Wave 5 Selection (Select, Combobox with merged Autocomplete per D-022, MultiSelect, Menu/Dropdown, ContextMenu, TagInput — 6 more) = 52/103.**

Card/Alert/Table/Stat moved into S ahead of schedule (see above) once a real page proved they were needed now, not later — this tier's own scope shrinks by exactly that much. What's left here is Select and the rest of the Selection wave. Select directly closes the demo app's dropdown gap. Menu/Dropdown and ContextMenu are `role="menuitem"`-based (D-023: Radix engine, deliberately never sharing a base with the `role="option"` Selection components) and were already flagged in `system/STATE.md` as needing their own `w5-menu-positioning.spec.ts` before the Popover multi-axis-collision TODO can close.

## L — v0.3

**+ all of Wave 6 Navigation (Tabs, BottomNav, Navbar, Sidebar, Breadcrumb, Pagination, Stepper, SegmentedControl, Accordion, NavigationMenu, Anchor/TOC — 11) + the rest of Wave 7 Data Display (List, DescriptionList, Timeline, Tag/Chip, EmptyState, Progress, Meter — 7, since Card/Alert/Table/Stat already shipped in S) + all of Wave 8 Advanced Input (Slider, RangeSlider, NumberInput, FileUpload, Dropzone, ColorPicker, Editable, PasswordInput, SearchInput, OTPFlow — 10) = 80/103.**

This is "build a full app shell" tier: real navigation chrome, richer data display beyond a single table, and the advanced input widgets that show up in settings/checkout/admin flows once the basics are covered. Every one of Wave 8's inputs still follows the same engine rule as everything before it (native where native suffices, a proven headless engine otherwise, never hand-rolled focus/keyboard behavior) — no new architectural exception gets introduced at this tier.

## XL — v1.0

**+ all of Wave 9 X-class (DataGrid, TreeView, DatePicker/Calendar/RangePicker, TimePicker, 4 Chart types, Carousel, VirtualList, TransferList — 12) + all of Wave 10 Patterns+Shell (CommandPalette, RichTextEditor, Form orchestration, Wizard, AppShell, AuthForms, SettingsLayout, NotificationCenter, Onboarding/CoachMark, KanbanBoard, Feed — 11) = 103/103.**

Every Wave 9/10 component is explicitly a wrapper around a proven external headless engine per `docs/CATALOG.md`'s own annotation (TanStack Table/Virtual, React Aria's date primitives, visx/ECharts, Embla, cmdk, TipTap, react-hook-form, dnd-kit) — these are "decades of edge cases someone else already solved," not components this system reinvents. This is also the tier where `docs/BLUEPRINT.md`'s Phase 6 (docs site + Storybook publish + real npm distribution polish) is expected to be fully mature, since v1.0 is the first release meant to be a complete, stable surface rather than a growing one.

## What doesn't move between tiers

The API Vocabulary Contract (D-024 — Collection family speaks `selectedKeys`/`onSelectionChange`, Standalone controls speak `value`/`checked`+`onChange`), the behavior-engine selection criteria (D-023), and every locked design decision in `system/DECISIONS.md` apply identically at every tier. A component doesn't get a design exception for shipping later — Wave 9's DataGrid follows the same non-color-cue and WCAG-contrast requirements Wave 1's Divider did.
