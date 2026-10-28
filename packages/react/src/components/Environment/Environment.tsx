import { forwardRef, type HTMLAttributes } from 'react';

export type EnvironmentBrightness = 'dim' | 'mid' | 'bright';
export type EnvironmentMaterial = 'glass' | 'solid';

export interface EnvironmentProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * How bright the world behind the glass is (D-009). Glass inside darkens to keep text ≥4.5:1.
   * Size it for the brightest spot a card can land on, not the scene's average. Default `bright`.
   */
  brightness?: EnvironmentBrightness;
  /**
   * `glass` (default) blurs and dims the scene behind every pane. `solid` swaps every pane inside for the
   * opaque surface and turns the backdrop filter off (D-021), for a live backdrop such as a 3D scene or
   * video, where re-blurring each frame costs the frame rate. Text contrast is the same measured fallback
   * used for reduced transparency.
   */
  material?: EnvironmentMaterial;
}

export const Environment = forwardRef<HTMLDivElement, EnvironmentProps>(function Environment({ brightness = 'bright', material = 'glass', ...rest }, ref) {
  return <div ref={ref} data-environment={brightness} data-material={material === 'solid' ? 'solid' : undefined} {...rest} />;
});
