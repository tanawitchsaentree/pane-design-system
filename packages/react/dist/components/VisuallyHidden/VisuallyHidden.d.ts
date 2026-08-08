import type { ComponentPropsWithoutRef, ReactNode } from 'react';
export interface VisuallyHiddenProps extends ComponentPropsWithoutRef<'span'> {
    children: ReactNode;
}
/**
 * VisuallyHidden — independent utility (D-012), no extra props beyond children. Renders content
 * that is invisible on screen but still exposed to assistive technology (standard "clip" pattern
 * — never `display: none`, which would remove it from the accessibility tree as well).
 * Anatomy: single root `span` element.
 */
export declare const VisuallyHidden: import("react").ForwardRefExoticComponent<VisuallyHiddenProps & import("react").RefAttributes<HTMLSpanElement>>;
//# sourceMappingURL=VisuallyHidden.d.ts.map