# NEXT — handoff 2026-11-01 (session closed by the user; everything below is committed and pushed)

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
0. **Liquid glass (R-045), waiting on the user**: open `apps/lab/liquid/index.html` in Chrome. The user picks A (refraction + colour split), B (refraction, no split) or keeps C. Then build it as tokens and a recipe (SVG displacement backdrop-filter from the SDF in the lab, Chromium only, C as the fallback), add a gate that measures the bend, and re-record the anchor (D-041 changes).
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
