import { forwardRef, useEffect, useRef, type HTMLAttributes } from 'react';
import { enableLiquid } from './liquid';

export type EnvironmentBrightness = 'dim' | 'mid' | 'bright';
export type EnvironmentMaterial = 'glass' | 'liquid' | 'solid';

export interface EnvironmentProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * How bright the world behind the glass is (D-009). Glass inside darkens to keep text ≥4.5:1.
   * Size it for the brightest spot a card can land on, not the scene's average. Default `bright`.
   */
  brightness?: EnvironmentBrightness;
  /**
   * `glass` (default) blurs and dims the scene behind every pane. `liquid` is the same glass, and each pane
   * also bends what is behind its rim and lifts its middle like a lens (R-045); it needs Chromium, and other
   * browsers show `glass`. `solid` swaps every pane inside for the opaque surface and turns the backdrop
   * filter off (D-021), for a live backdrop such as a 3D scene or video, where re-blurring each frame costs
   * the frame rate. Text contrast is the same measured fallback used for reduced transparency.
   */
  material?: EnvironmentMaterial;
}

export const Environment = forwardRef<HTMLDivElement, EnvironmentProps>(function Environment({ brightness = 'bright', material = 'glass', ...rest }, ref) {
  const own = useRef<HTMLDivElement | null>(null);
  // liquid gives each glass surface its own lens; every other material leaves the surfaces as they are
  useEffect(() => (material === 'liquid' && own.current ? enableLiquid(own.current) : undefined), [material]);
  const setRef = (node: HTMLDivElement | null) => {
    own.current = node;
    if (typeof ref === 'function') ref(node); else if (ref) ref.current = node;
  };
  return <div ref={setRef} data-environment={brightness} data-material={material === 'glass' ? undefined : material} {...rest} />;
});
