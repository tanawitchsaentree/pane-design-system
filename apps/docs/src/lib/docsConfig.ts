/**
 * Site-level config the docs-engine editorial capability reads (`docs.repoUrl` per the
 * docs-engine-v2 order). Absent/undefined means "no public remote yet" — every consumer of this
 * value (navbar links, landing page CTA) must render a locally-appropriate alternative instead of
 * a dead href, never fall back to a guessed URL.
 */
export const docsConfig = {
  /** GitHub/repo URL. `undefined` today — confirmed via `git remote -v` returning nothing and
   * every component page's own Source section already stating "no public remote yet." */
  repoUrl: undefined as string | undefined,
};
