/**
 * Shared token-shaped prop types for layout primitives (D-012).
 * `SpaceToken` mirrors the numeric step keys declared in
 * packages/tokens/src/semantic/space.json (`space.<step>`) — every primitive that accepts a
 * `gap`/`size` prop typed as `SpaceToken` maps it to `var(--ds-space-<step>)` via a CSS Module
 * attribute selector, never a raw px/rem value in component code.
 */
export type SpaceToken = '0' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | '1000' | '1100';

export const SPACE_TOKENS: readonly SpaceToken[] = ['0', '100', '200', '300', '400', '500', '600', '700', '800', '900', '1000', '1100'];

/**
 * Shared token-shaped prop types for Wave 2 atoms (D-013). Every union below mirrors a token
 * scale that is already locked in system/DECISIONS.md — components must only ever pick a value
 * from these unions and map it to `var(--ds-*)` in CSS, never author a raw dimension/color.
 */

/** Type scale step (D-005: base 16, ratio 1.2, flat — hierarchy comes from layout, not font). */
export type FontSizeToken = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
export const FONT_SIZE_TOKENS: readonly FontSizeToken[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'];

/** Font weight step (D-005). */
export type FontWeightToken = 'regular' | 'medium' | 'semibold' | 'bold';
export const FONT_WEIGHT_TOKENS: readonly FontWeightToken[] = ['regular', 'medium', 'semibold', 'bold'];

/** Semantic text color role (`color.text.*`, D-006). */
export type TextColorToken = 'default' | 'subtle' | 'disabled' | 'inverse';
export const TEXT_COLOR_TOKENS: readonly TextColorToken[] = ['default', 'subtle', 'disabled', 'inverse'];

/** `size.icon.*` t-shirt scale — 16/20/24/32 (D-004). */
export type IconSizeToken = 'sm' | 'md' | 'lg' | 'xl';
export const ICON_SIZE_TOKENS: readonly IconSizeToken[] = ['sm', 'md', 'lg', 'xl'];

/** `size.avatar.*` t-shirt scale — 24/32/40/48/64/96 (D-004). */
export type AvatarSizeToken = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export const AVATAR_SIZE_TOKENS: readonly AvatarSizeToken[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];

/** `size.control.*` t-shirt scale — 40/48/56/64 (D-004: md=48, Braun-thick). */
export type ControlSizeToken = 'sm' | 'md' | 'lg' | 'xl';
export const CONTROL_SIZE_TOKENS: readonly ControlSizeToken[] = ['sm', 'md', 'lg', 'xl'];

/** `radius.*` scale (D-008: soft-rounded, no sharp/pill-only). */
export type RadiusToken = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
export const RADIUS_TOKENS: readonly RadiusToken[] = ['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full'];

/** Semantic color role reused by feedback-style components (Badge). Brand kept scarce per D-001. */
export type ColorRoleToken = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
export const COLOR_ROLE_TOKENS: readonly ColorRoleToken[] = ['neutral', 'brand', 'success', 'warning', 'danger', 'info'];

/** Button/IconButton visual intent (D-001 accent scarcity: `primary` reserved for the single most important action). */
export type ActionIntent = 'primary' | 'neutral' | 'danger';
export const ACTION_INTENTS: readonly ActionIntent[] = ['primary', 'neutral', 'danger'];
