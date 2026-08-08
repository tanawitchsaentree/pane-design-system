import type { FlexProps } from '../Flex/Flex';
import type { SpaceToken } from '../../types';
export type StackDirection = 'vertical' | 'horizontal';
export interface StackProps extends Omit<FlexProps, 'direction'> {
    /** `'vertical'` maps to Flex `column`, `'horizontal'` maps to Flex `row`. Default `'vertical'`. */
    direction?: StackDirection;
    /** Gap between stacked children. Default `'300'` (D-012). */
    gap?: SpaceToken;
}
/**
 * Stack — thin wrapper over Flex (D-012) for the common "stack of blocks" case.
 * Anatomy: single root element (the underlying Flex/Box).
 */
export declare const Stack: import("react").ForwardRefExoticComponent<StackProps & import("react").RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=Stack.d.ts.map