import type { BoxProps } from '../Box/Box';
export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
export interface ContainerProps extends BoxProps {
    /** Max-width breakpoint (D-007). `'full'` removes the max-width cap. Default `'lg'` (D-002 anchor). */
    size?: ContainerSize;
}
/**
 * Container — centers content and caps width per breakpoint, extending Box (D-012).
 * Anatomy: single root element (the underlying Box).
 */
export declare const Container: import("react").ForwardRefExoticComponent<ContainerProps & import("react").RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=Container.d.ts.map