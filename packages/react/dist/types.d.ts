/**
 * Shared token-shaped prop types for layout primitives (D-012).
 * `SpaceToken` mirrors the numeric step keys declared in
 * packages/tokens/src/semantic/space.json (`space.<step>`) — every primitive that accepts a
 * `gap`/`size` prop typed as `SpaceToken` maps it to `var(--ds-space-<step>)` via a CSS Module
 * attribute selector, never a raw px/rem value in component code.
 */
export type SpaceToken = '0' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | '1000' | '1100';
export declare const SPACE_TOKENS: readonly SpaceToken[];
//# sourceMappingURL=types.d.ts.map