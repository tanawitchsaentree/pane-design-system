import type { BoxProps } from '../Box/Box';
export type AspectRatioPreset = 'square' | 'video' | 'photo' | 'portrait' | 'golden';
export interface AspectRatioProps extends BoxProps {
    /**
     * Preset name (bound to `ratio.*` tokens: square=1, video=16/9, photo=4/3, portrait=3/4,
     * golden=1.618) or an arbitrary number (width/height) for cases the token scale doesn't cover.
     */
    ratio: AspectRatioPreset | number;
}
/**
 * AspectRatio — constrains children to a fixed width/height ratio, extending Box (D-012).
 * Anatomy: root element + single absolutely-positioned content layer filling it.
 */
export declare const AspectRatio: import("react").ForwardRefExoticComponent<AspectRatioProps & import("react").RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=AspectRatio.d.ts.map