import type { BoxProps } from '../Box/Box';
import type { SpaceToken } from '../../types';
export interface GridResponsiveColumns {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
}
export interface GridProps extends BoxProps {
    /** Number of grid columns. Default `12` (D-007 12-column grid). */
    columns?: number;
    /** Gap between grid cells — must reference a `space.*` token step. */
    gap?: SpaceToken;
    /**
     * Optional per-breakpoint column override (`sm`/`md`/`lg`/`xl`). Breakpoints follow D-007
     * (sm 640 / md 768 / lg 1024 anchor / xl 1280). Unset breakpoints inherit the previous one.
     */
    responsive?: GridResponsiveColumns;
}
/**
 * Grid — CSS Grid layout primitive extending Box (D-012).
 * Anatomy: single root element (the underlying Box).
 */
export declare const Grid: import("react").ForwardRefExoticComponent<GridProps & import("react").RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=Grid.d.ts.map