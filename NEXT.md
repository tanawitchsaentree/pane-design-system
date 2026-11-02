# NEXT — handoff 2026-11-02 (context cleared by the user; read this first)

## State 2026-11-02 afternoon (0.8.3 live)
- **0.8.3 is deployed and on GitHub main** (ce49549). It has the demo stage B (glass, liquid and solid at once, the user's pick), nesting materials (a solid donut @scope, liquid that stops at a nested Environment, an unset material that inherits), an Overview without the card grid, the FAB spec frame fix, the New tag by release, and a default backdrop of Room. **npm still has 0.8.1**; the user publishes `release/pane-react-0.8.3.tgz`.
- **Never gate a release on a full verify again** (the user was angry 2026-11-02, memory no-long-verify-runs). Ship on targeted `KILN_ROUTES` evidence + build. A full run, if any, goes in the background after the deploy.
- The full verify killed twice was dial's `pkill -f "tooling/kiln/(verify|…)"`; dial now kills by PID. A third full run started 13:50 in the background. Its log is in the job tmp, and it is not a gate.
- **Full verify (third run) finished: 17/21 steps.** The material stage clipped renders in narrow columns, which caused about 130 evidence reds. Fixed and deployed (2f1b336): the stage is now one row per material. Still red:
  - **evidence:** 15 reds already in the 11-01 run (DescriptionList on studio, PullToRefresh "Inbox", Wizard "Size") and 10 new ones on VirtualList's faded last row ("Order 100004", mostly in the liquid column).
  - **conformance 472/478:** Environment reduced-motion .38s, Button hover 0.38s vs 420ms, Image no failed example, DatePicker Esc, PaneProvider Thai ×2.
  - **gates:** G-R1 (onboard caption 13px), G-PF2 (17 pages over 1.5 MB), G-F1 (3 foundations with no playground control), G-NT2 (57 control edges under 3:1), G-GL1 (3), G-BR1 (Carousel "1 of 3" on the photo); tone also red.
  - Fix these from targeted runs (`KILN_ROUTES`), never another full run.
- Open: Pane's "Pane at a glance" scenario stages still use the old rounded slab. kiln is building G-SH1 (shell convergence) and will ask the user who tells dial.

## State 2026-11-02 (after 0.8.2)
- **0.8.2 is built, deployed and on GitHub** (2987444). Conformance is 468/468. G-C1, G-PUB1, G-MO1, G-MO3, G-MO4 and G-PC1 pass on the changed pages. **npm still has 0.8.1** until the user runs `npm publish ./release/pane-react-0.8.2.tgz --access public`.
- kiln 2.7.0 is synced (072e569). **The next verify must be a full `pnpm run verify`** (new hash format; it records the manifest and reach map). After that, use `pnpm run verify:topup` for fixes. That full run will also refresh the stale evidence and verify from 2026-10-28.
- **kiln** is owned by the session "Kiln กับ AI design skills อื่น ๆ" (was kiln-48). It has 2.6.5 synced here (81fed77). It is working on K-13 incremental verify (2.7) and the user's token-waste spec. Its pushes need the user's permission in its own window. Never edit kiln from Pane; ask it.
- Other sessions waiting on the user's permission: PEG (peg-c4) and lego builder (lego-builder-91), both told to move to pane-react 0.8.1. They can now simply `npm install pane-react@latest`.


## Where things stand
- **Pane 0.7.0 live** at https://pane-design-system.pages.dev (main = release-0.7, deployed with wrangler).
  Today it gained motion rhythm (R-044), Onboard your agent (/agent-setup/prompt.md, tarball at
  /downloads/pane-react-0.7.0.tgz, tested from an empty folder), DESIGN.md, the Platforms page, the HTML
  block under every demo, and Kotlin/Dart/Tailwind/Figma tokens (D-042).
- **kiln 2.6.0** pushed to github.com/tanawitchsaentree/Kiln (marketplace); the user's plugin is 2.6.0.
  Engine synced here (tooling/kiln). Release notes: kiln/marketplace/plugins/kiln/CHANGELOG.md.
- **dial** (second kiln system, ~/Downloads/bauhouse-ds, its own session bauhouse-ds-9e): wave 1 done,
  24 components, M1 verify in progress. It has engine 2.5.3 + its own fixes; it was told to sync 2.5.4
  after (or instead of) its running full verify. 2.6.0 adds six gates, so sync that after M1 closes.
  system/refs/ref-01.png was still missing at last check, so dial's colours are estimates from chat.

## Do next, in this order
0. **Done 2026-11-01 late (0.8.0 live):** liquid material (user picked B + C), anchor knobs (Environment `look`, `--ds-look-*`, D-043), demo toolbar, inline code chips and the Resources pill (R-047). Still to do: a full evidence run with material=liquid, and a gate that measures the bend. PEG was asked to move to 0.8.0 + liquid, but its session's permission check blocked the tarball download. The user decides there; never install into PEG from this repo.
   Also: launch drafts are in `system/reports/launch-posts.md`. The user posts them; the share card and README are live.
1. **Pane full verify + evidence.** The last full verify is from 2026-10-28 and the evidence from
   2026-11-01 00:12; both predate today's changes, so the book's numbers describe older code. Run
   `pnpm run verify` (about an hour, nice 19) only when dial is not running its own full verify (machine
   load), then rebuild and deploy with the release recipe in memory (pane-scope-calls).
2. **Evidence reds: 34** in the last full run (anatomy pins on text, some forced-colors cases).
3. **Motion choreography**: G-MO1 measures hover and press only. Add enter/exit of dialog, sheet and popover
   (decelerate in, accelerate out, exit ≤ 0.6 × enter) and the distance rule from
   references/foundations/motion.md, then look at Pane's motion.enter (640ms).
4. **G-PG1**: mark Pane's playground controls with `data-playground-token` so the gate measures them.
5. **Still-open gate items**: a popup opened inside a popup stacks above it; docs controls with ≤3 options
   are segmented (BACKLOG R-035/R-038 lines).
6. **kiln**: prove the 55 gates that have no planted-violation proof yet; score the 108 failure scenarios
   (docs/PANE-RETRO-ANALYSIS.md 68 + RETRO R-001..R-044) by frequency × detectability; a taste measure
   beyond anchor likeness.
7. **Pro tier** (memory pane-monetize-goal): package split, license-key check, pricing page. The user owns
   accounts, prices and publishing.
8. npm publish stays the user's.

## Rules that still hold
Thai replies; no Storybook; never mention Xcode; push + deploy for Pane are authorised; never handle a
credential; keep tool output tiny; check only what changed while working; one preview server at most and
stop it at the end (none is running now).
