import type { FlexProps } from '../Flex/Flex';
export type CenterProps = Omit<FlexProps, 'align' | 'justify'>;
/**
 * Center — centers its children both axes via Flex (D-012).
 * Anatomy: single root element (the underlying Flex/Box).
 */
export declare const Center: import("react").ForwardRefExoticComponent<CenterProps & import("react").RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=Center.d.ts.map