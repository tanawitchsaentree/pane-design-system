import type { BoxProps } from '../Box/Box';
import type { SpaceToken } from '../../types';
export type FlexDirection = 'row' | 'column';
export type FlexAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type FlexJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
export type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse';
export interface FlexProps extends BoxProps {
    /** Flex-direction. Default `'row'`. */
    direction?: FlexDirection;
    /** Gap between flex children — must reference a `space.*` token step, never a raw value. */
    gap?: SpaceToken;
    /** align-items. */
    align?: FlexAlign;
    /** justify-content. */
    justify?: FlexJustify;
    /** flex-wrap. Default `'nowrap'`. */
    wrap?: FlexWrap;
}
/**
 * Flex — flexbox layout primitive extending Box (D-012).
 * Anatomy: single root element (the underlying Box).
 */
export declare const Flex: import("react").ForwardRefExoticComponent<FlexProps & import("react").RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=Flex.d.ts.map