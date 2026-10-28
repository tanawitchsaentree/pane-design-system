import { forwardRef, type HTMLAttributes } from 'react';

export type EnvironmentBrightness = 'dim' | 'mid' | 'bright';

export interface EnvironmentProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * How bright the world behind the glass is (D-009). Glass inside darkens to keep text ≥4.5:1.
   * Size it for the brightest spot a card can land on, not the scene's average. Default `bright`.
   */
  brightness?: EnvironmentBrightness;
}

export const Environment = forwardRef<HTMLDivElement, EnvironmentProps>(function Environment({ brightness = 'bright', ...rest }, ref) {
  return <div ref={ref} data-environment={brightness} {...rest} />;
});
