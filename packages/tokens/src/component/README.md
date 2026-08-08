# component/ — intentionally empty for now

Phase 2 (Tokens) only generates `primitive/` and `semantic/`. Component tokens
(e.g. `button.bg.primary.default`, `card.padding`) get added per-component in
Phase 3+ via `/new-component` or `production-run`, one JSON file per component
(`component/button.json`, `component/card.json`, ...), each token pointing
**only** at `semantic/*` — never at `primitive/*` directly (see
`docs/BLUEPRINT.md` §3.1 "กฎเหล็ก" and `.claude/skills/ds-conventions`).

No component exists yet in this system (`Dial`), so there is nothing to author
here yet — this is a placeholder so the 3-layer folder structure is complete
and Style Dictionary can be pointed at `component/**/*.json` from day one
without needing a config change later.
