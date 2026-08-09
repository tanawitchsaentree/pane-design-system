# demo-app

A real Settings page built with `@dial/react` (ORDERS block B2) — form + selection (RadioCards, Listbox) + dialog + toast + rating, all on the actual workspace package, not a cherry-picked story.

## Run it

```bash
pnpm --filter demo-app dev
```

## What this exercised, and what it found

Verified working end-to-end (typecheck, real browser render, real interactions — see the commit history for the exact Playwright checks run): form fields, RadioCards plan selection, Listbox multi-select, Switch toggles, Rating, Dialog open/confirm/cancel, Toast on save. No console errors, no page errors.

Two real gaps surfaced, reported per instruction rather than silently patched around:

1. **No `Card` component yet.** Every section on this page is separated with plain `Stack` + `Divider` instead of a bordered/elevated container. It reads fine here, but any real settings page reaches for visual grouping stronger than a horizontal rule almost immediately. Already tracked for v0.2 ("M" tier) in the roadmap.
2. **Listbox is the only Selection-family component in v0.1**, so it's standing in for what should be a closed dropdown (`Select`) for "preferred languages" — an always-open list taking up permanent vertical space is visibly the wrong widget for that spot. `Select` is in progress; this is exactly the kind of gap that confirms it's needed, not a surprise.

One thing that blocked the build outright and had to be fixed to get this demo compiling at all (not deferred, since a broken build isn't a "note for later"): `@dial/react`'s root `index.ts` didn't re-export the `Key` type that `Listbox`'s own public API (`selectedKeys`, `onSelectionChange`) requires consumers to type against — a TypeScript consumer had no way to write `useState<ReadonlySet<Key>>` without reaching into an internal module path. Fixed by adding `Key` to both `Listbox`'s own barrel file and the package root's `index.ts`.
