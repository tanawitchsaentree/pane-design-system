import type { BoxProps } from '../Box/Box';
import type { SpaceToken } from '../../types';
export interface SpacerProps extends Omit<BoxProps, 'children'> {
    /** Fixed size referencing a `space.*` token. Omit to grow and fill available space (`flex: 1`). */
    size?: SpaceToken;
}
/**
 * Spacer — utility primitive extending Box (D-012). Purely presentational spacing, never
 * carries content — marked `aria-hidden` so screen readers skip it like they would empty
 * whitespace.
 * Anatomy: single root element (the underlying Box), no children.
 */
export declare const Spacer: import("react").ForwardRefExoticComponent<SpacerProps & import("react").RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=Spacer.d.ts.map