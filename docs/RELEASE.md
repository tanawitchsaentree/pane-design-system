# Release — publishing @dial/tokens + @dial/react to npm

**This is a manual, human-run process.** No agent session runs `npm login` or `npm publish` — publishing is irreversible enough (you cannot re-publish the same version number, ever, even after unpublishing) that it stays a deliberate action you take yourself in your own terminal, not something automated on your behalf.

## One-time setup (first release only)

1. Create an npm account if you don't have one: https://www.npmjs.com/signup
2. Reserve the `@dial` org/scope on npm **before** anyone else can claim it — as of this doc being written, `@dial` is unclaimed (verified via `npm view @dial/tokens` returning 404 and `/-/org/dial` also 404), but that isn't a reservation, just an absence. Create the org at https://www.npmjs.com/org/create or by publishing the first scoped package under it (npm auto-creates the scope for you on first publish if you're logged in and no one else owns it).
3. If you want 2FA-gated publishing (recommended for anything public): enable it under your npm account settings.

## Every release

```bash
# 1. Log in (interactive — enter your npm credentials/2FA when prompted)
npm login

# 2. Confirm you're logged in as the right account
npm whoami

# 3. Publish tokens first (react doesn't depend on it at the npm dependency-resolution level,
#    but publishing in this order means anyone who happens to `npm install @dial/tokens` first
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
#   lint:no-hardcode -> typecheck -> test -> build -> pack-verify

# 5. Verify both are live
npm view @dial/tokens version
npm view @dial/react version
```

## Bumping the version for a future release

This repo does not yet use [Changesets](https://github.com/changesets/changesets) (named in `docs/BLUEPRINT.md`'s stack but never actually set up) — for now, version bumps are manual:

```bash
cd packages/tokens && npm version <patch|minor|major>
cd ../react && npm version <patch|minor|major>
```

Update each package's `CHANGELOG.md` with what changed before running `npm publish`. If this repo starts cutting releases often enough that manual CHANGELOG writing becomes a bottleneck, that's the point where actually setting up Changesets pays for itself — not before.

## If something goes wrong

- **Published the wrong content**: `npm unpublish @dial/react@0.1.0` works only within 72 hours of publishing, and npm strongly discourages it (the version number becomes permanently unusable either way — re-publishing the same version number is never possible, unpublished or not). Prefer publishing a patch version with the fix instead.
- **`prepublishOnly` failed partway**: nothing was published — npm aborts the publish entirely if any `prepublishOnly` script exits non-zero. Fix the failure, re-run `npm publish`.
- **Need to test the tarball without publishing**: `pnpm run pack-verify` (from inside either package directory) runs the exact same pack → scratch-install → resolve-every-path check that `prepublishOnly` runs, without needing to be logged in to npm at all.
