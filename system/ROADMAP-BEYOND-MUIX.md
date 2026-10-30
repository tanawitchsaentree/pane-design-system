# Beyond MUI X (user, 2026-10-30: "ไปให้ไกลกว่า MUI X ในทุกๆด้าน")

Each stage is code + tokens + why + docs + gates + conformance, committed on its own, before the next
starts. "Beyond" means: everything MUI X has in Community, Pro and Premium, with no licence tier, plus
what MUI X does not do (gated accessibility, Thai and Buddhist calendar first-class, plain-HTML recipes,
MCP for agents, a state matrix that proves every state).

| # | Stage | MUI X has | Pane goes further with |
|---|---|---|---|
| X1 | i18n | locale packs, localeText | `PaneProvider` (locale, messages, dir), en + th packs, Intl formatting for numbers, dates and plurals, Buddhist era option; gate G-I18N fails any built-in string not from the catalog |
| X2a | Grid: find | sort, filter, quick filter, pagination, toolbar, CSV/print export | multi-sort, filter per column type with chips that say the filter in words, URL-free saved views, export CSV and print with the table view's a11y |
| X2b | Grid: columns | resize, reorder, visibility, pinning, header groups (Pro) | all of it, keyboard-operable (resize and reorder by keys, announced), pinning both ends |
| X2c | Grid: edit | cell and row editing, clipboard (Premium) | typed editors from the field family, validation through FormField, undo/redo, paste with a preview of what will change |
| X2d | Grid: scale | virtualisation (Pro), server-side data | rows and columns virtualised with aria-rowcount kept true, a server mode with cancellation |
| X2e | Grid: shape | row grouping, aggregation, tree data, master-detail, pivot (Premium) | all free, with group rows that read as headings to screen readers |
| X3 | Pickers | date, time, date-time, ranges (Pro), fields, shortcuts, timezones, calendar systems | typed segment fields, shortcuts, month/year views, Buddhist and other calendars through Intl, timezone shown in words |
| X4 | Charts | bar, line, pie, scatter, gauge, radar, heatmap, funnel, sankey, candlestick (Premium), zoom, export (Pro) | every type with the table view and keyboard reading, composition, brush, export, linked highlight, an audio graph for screen readers |
| X5 | Tree | simple/rich, selection, lazy loading, drag reorder (Pro), editing | checkbox selection with mixed state, lazy children, reorder by drag and by keys, virtualised |
| X6 | Scheduler | preview | day, week, month, agenda; events moved and resized by keys; recurrence; timezones |
| X7 | Chat | preview | message list, composer, streaming text, attachments, tool-call blocks, all announced politely |
| X8 | Practice | unit tests, coverage, versioned docs, AGENTS.md | Vitest + coverage gate next to the browser gates, versioned docs, migration guides, `pane-mcp` + `llms.txt`, plain-HTML recipes (`pane-css`) |

## X9 · Open core, hands-off income (user, 2026-10-30)
Free MIT core with every component; a paid Pro tier for what teams pay MUI for (advanced DataGrid from
X2b on, Scheduler, Pro charts, Figma kit, extra themes). Sold through a merchant of record (Lemon Squeezy
or Paddle) that takes the payment, handles tax and emails a signed license key. The key is checked
offline in the package (no server); without it Pro shows an "unlicensed" mark. Pane builds: the package
split, key verification and watermark, the key-issuing script, the pricing page and launch docs. The
user owns: the store account, prices, the npm account and publish, the licence text (with a lawyer).

## X11 · Canvas, graphs and provenance (consumer feedback, 2026-10-30)
NodeCard (a node on a canvas: ports, selected, dragging, collapsed, keyboard move), NetworkGraph (mini and
full, with a nodes-and-edges table view), SequenceDiagram (actors in lanes, messages between them), a
sequential data ramp and an ordinal ConfidenceChip (D-032: confidence is magnitude, never categorical hue),
a provenance Badge kind (live, sample, synthetic, stale) with its pattern page, and an optional dev-only
PerfOverlay in `pane-react/devtools`. MoneyFlow is X4's Sankey.

## X10 · Native (user, 2026-10-30: "ทำให้หมดเลยกูจะเทสทดสอบใน mobile iOS")
`packages/tokens/build.mjs` also writes `build/swift/PaneTokens.swift` (every token, dark and light, colours
dynamic per appearance). `packages/swift/PaneKit` is the SwiftUI library (iOS 17, macOS 14) on those
tokens, with English and Thai messages; `apps/ios/PaneGallery.swiftpm` is the app to run on an iPhone.
MUI X has no native side at all. Next: Kotlin/Compose tokens for Android, and the rest of the families.
