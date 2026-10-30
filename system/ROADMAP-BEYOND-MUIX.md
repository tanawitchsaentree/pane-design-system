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
