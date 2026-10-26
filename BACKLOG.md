# Backlog

Single backlog for the kiln engine. Dial's backlog history moved with it to the `dial` repo
(tag `dial-final` in this repo marks the split).

Not a priority list — order of discovery.

---

## Engine still carries Dial assumptions (found during the 2026-10-26 split)

- `tooling/generate-barrel.selftest.mjs` copies the real `packages/react/src/index.ts` instead of
  a fixture — fails on a blank engine. Needs its own fixture under `tooling/__fixtures__/`.
- Dial names/paths still hard-coded in: `tooling/{pack-verify,smoke-import,doc-count-check,
  generate-barrel,contrast-check,story-categories,spacing-check}.mjs`, `docs/{BLUEPRINT,CATALOG,
  KIT-CHANGELOG}.md`, `.claude/skills/{ds-conventions,production-run}/SKILL.md`. Should read the
  system's package names from `system/` config instead.
- `apps/docs` + `apps/storybook` shells left with Dial (they mixed engine chrome with Dial
  content). Engine needs them back as templates under `templates/`, content-free.
- `.claude/settings.json` hooks don't enforce: PostToolUse lint ends in `|| echo` (always exit 0,
  never blocks), PreToolUse reads `$CLAUDE_TOOL_INPUT`, which hooks don't receive (input comes as
  JSON on stdin), so the DECISIONS.md guard likely never fires. UNVERIFIED — not run yet.
