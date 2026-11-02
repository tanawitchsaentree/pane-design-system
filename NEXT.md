# NEXT — handoff 2026-11-02 (context cleared by the user; read this first)

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
