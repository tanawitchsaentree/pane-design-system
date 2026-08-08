import type { BoxProps } from '../Box/Box';
export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerVariant = 'hairline' | 'hairline-strong';
export interface DividerProps extends Omit<BoxProps, 'children'> {
    /** Default `'horizontal'`. */
    orientation?: DividerOrientation;
    /** Border weight, both bound to D-008 border tokens. Default `'hairline'`. */
    variant?: DividerVariant;
}
/**
 * Divider — a hairline rule extending Box (D-012), styled per D-008 (no decorative shadow —
 * hairline border tokens are the definition mechanism in this system).
 * Anatomy: single root element (the underlying Box), `role="separator"`.
 * A11y: exposes `role="separator"` and `aria-orientation` so assistive tech announces it as a
 * structural divider, not decorative content.
 */
export declare const Divider: import("react").ForwardRefExoticComponent<DividerProps & import("react").RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=Divider.d.ts.map