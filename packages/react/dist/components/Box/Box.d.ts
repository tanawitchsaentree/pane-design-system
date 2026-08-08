import type { ComponentPropsWithoutRef, ReactNode } from 'react';
export interface BoxProps extends ComponentPropsWithoutRef<'div'> {
    /**
     * Render as the single child element instead of a `div` (Radix-style polymorphism).
     * The child must forward `ref` and accept the props Box spreads onto it.
     */
    asChild?: boolean;
    children?: ReactNode;
}
/**
 * Box — the base of every layout primitive in the system (D-012).
 * Deliberately has no variant/size prop: it is a plain, styleable box-model reset.
 * Anatomy: single root element (`div` by default, or the `asChild` child).
 */
export declare const Box: import("react").ForwardRefExoticComponent<BoxProps & import("react").RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=Box.d.ts.map