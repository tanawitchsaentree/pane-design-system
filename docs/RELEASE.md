# Release — publishing dial-tokens + dial-react to npm

**This is a manual, human-run process.** No agent session runs `npm login` or `npm publish` — publishing is irreversible enough (you cannot re-publish the same version number, ever, even after unpublishing) that it stays a deliberate action you take yourself in your own terminal, not something automated on your behalf.

## One-time setup (first release only)

1. Create an npm account if you don't have one: https://www.npmjs.com/signup
2. Nothing to reserve — both packages are **unscoped** (`dial-tokens`, `dial-react`), so there is no npm org to create. See "Why unscoped" below before renaming anything.
3. If you want 2FA-gated publishing (recommended for anything public): enable it under your npm account settings.

## Why unscoped (and how to check a name properly)

The packages were originally `@dial/tokens` and `@dial/react`. **The `@dial` scope already has an owner**, so publishing under it fails with 403 — they were renamed to unscoped names before the first release.

How to verify a name, because the obvious check does not work. `npm view <pkg>` returning 404 means that *package* does not exist; it says nothing about whether the *scope* is owned. `/-/user/<name>` and `/-/org/<name>` return 404 for every name, including names that certainly have owners, so those 404s are not evidence either. Two endpoints that do discriminate:

```bash
# is a SCOPE owned?  200 = taken, 404 "Scope not found" = free
curl -s https://registry.npmjs.org/-/org/dial/user      # {"dial":"owner"}            <- taken
curl -s https://registry.npmjs.org/-/org/dialui/user    # {"error":"Scope not found"} <- free

# is an UNSCOPED name taken?  200 = taken, 404 = free
curl -s -o /dev/null -w '%{http_code}\n' https://registry.npmjs.org/dial-tokens   # 404 <- free
curl -s -o /dev/null -w '%{http_code}\n' https://registry.npmjs.org/react         # 200 <- taken
```

Always run a known-taken and a known-free control alongside the real query (`react`/`lodash` → 200, a nonsense name → 404). Without controls a 404 could just as easily mean the endpoint is wrong, which is exactly the mistake that produced the earlier "the scope is free" note.

**npm's similarity rule** can still reject a name at publish time: a new name may not differ from an existing package only by punctuation or case. Both names were checked against every punctuation/case collapse (`dialtokens`, `dial.tokens`, `dial_tokens`, `DialTokens`, and the `dial-react` equivalents — all 404). If a publish is nonetheless rejected on similarity grounds, the error text names the conflicting package; pick the next name deliberately rather than guessing.

Renaming again costs 30 files / ~98 occurrences (21 files of code and config that break the build if missed, 9 files of prose); `pnpm-lock.yaml` regenerates itself via `pnpm install`. `publishConfig.access: "public"` is **not** needed for unscoped packages — they are public by default — and was removed so it cannot read as "still scoped" later.

## Every release

```bash
# 1. Log in (interactive — enter your npm credentials/2FA when prompted)
npm login

# 2. Confirm you're logged in as the right account
npm whoami

# 3. Publish tokens first (react doesn't depend on it at the npm dependency-resolution level,
#    but publishing in this order means anyone who happens to `npm install dial-tokens` first
#    finds something there)
cd packages/tokens
npm publish
# ^ this actually triggers `prepublishOnly` automatically (defined in package.json):
#   build -> pack-verify (packs a real tarball, installs it into a scratch project, and
#   confirms every declared exports/main path resolves to a real file) — if pack-verify fails,
#   the publish is aborted before anything reaches the registry.

# 4. Publish react
cd ../react
npm publish
# ^ same mechanism, but prepublishOnly here runs the FULL gate first:
#   barrel:check -> story:check -> doc:check -> lint:no-hardcode -> typecheck -> test -> build
#   -> pack-verify -> smoke:import
#   doc:check compares every count written in the docs against the thing it counts (catalog total
#   summed from CATALOG.md's own wave markers, shipped components read from barrel.manifest.mjs) —
#   it exists because that number drifted silently six separate times.
#   smoke:import packs BOTH packages, installs them together into a scratch project, resolves every
#   documented entry point by published name, and renders components — it is what catches a rename
#   or exports change that pack-verify (one package, paths only) cannot see.

# 5. Verify both are live
npm view dial-tokens version
npm view dial-react version
```

## Bumping the version for a future release

This repo does not yet use [Changesets](https://github.com/changesets/changesets) (named in `docs/BLUEPRINT.md`'s stack but never actually set up) — for now, version bumps are manual:

```bash
cd packages/tokens && npm version <patch|minor|major>
cd ../react && npm version <patch|minor|major>
```

Update each package's `CHANGELOG.md` with what changed before running `npm publish`. If this repo starts cutting releases often enough that manual CHANGELOG writing becomes a bottleneck, that's the point where actually setting up Changesets pays for itself — not before.

## If something goes wrong

- **Published the wrong content**: `npm unpublish dial-react@0.1.0` works only within 72 hours of publishing, and npm strongly discourages it (the version number becomes permanently unusable either way — re-publishing the same version number is never possible, unpublished or not). Prefer publishing a patch version with the fix instead.
- **`prepublishOnly` failed partway**: nothing was published — npm aborts the publish entirely if any `prepublishOnly` script exits non-zero. Fix the failure, re-run `npm publish`.
- **`ERR_PNPM_NO_SCRIPT Missing script: <name>`**: `prepublishOnly` chains scripts by name, and a name that does not exist fails the whole chain at that point. This happened for real: `barrel:check` and `story:check` were listed in the chain and documented as wired, but neither was ever defined in `packages/react/package.json` — so the chain had never once run to completion, and the first thing `npm publish` would have done is fail. If you add a step to the chain, run `pnpm run prepublishOnly` from inside the package afterwards; a chain nobody has executed is not a gate.
- **Need to test the tarball without publishing**: `pnpm run pack-verify` (from inside either package directory) runs the exact same pack → scratch-install → resolve-every-path check that `prepublishOnly` runs, without needing to be logged in to npm at all. `pnpm run smoke:import` (from the repo root) goes further: it installs both tarballs into a scratch project together and imports/renders them as a real consumer would. Neither needs npm credentials.
- **npm rejects the package name on publish** (`E403` mentioning a similar existing package): that is npm's similarity rule, not a gate failure — nothing was published. The error text names the package it collided with. Both current names were checked against punctuation/case variants before release (see "Why unscoped"), so a rejection here means something new was published upstream in the meantime; pick the replacement name deliberately, re-verify with controls, then redo the rename (30 files / ~98 occurrences).
