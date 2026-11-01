import { forwardRef, useEffect, useRef, type CSSProperties, type HTMLAttributes } from 'react';
import { enableLiquid } from './liquid';

export type EnvironmentBrightness = 'dim' | 'mid' | 'bright';
export type EnvironmentMaterial = 'glass' | 'liquid' | 'solid';

/** The anchor knobs: a few roots, and every corner and gap derived from them so the system stays in proportion. */
export interface EnvironmentLook {
  /** The pane corner in px. Inner surfaces, media and controls follow it (controls stay pills above 20px). */
  corner?: number;
  /** Every gap at once: `compact` 0.85, `regular` 1, `roomy` 1.15, or a factor. */
  density?: 'compact' | 'regular' | 'roomy' | number;
  /** Control corners: `auto` follows the pane corner (default), `pill` always, or a px value. */
  controls?: 'auto' | 'pill' | number;
}
const DENSITY = { compact: 0.85, regular: 1, roomy: 1.15 } as const;
const lookStyle = (l: EnvironmentLook): CSSProperties => {
  const v: Record<string, string> = {};
  if (l.corner != null) v['--ds-look-corner'] = `${l.corner}px`;
  if (l.density != null) v['--ds-look-density'] = String(typeof l.density === 'number' ? l.density : DENSITY[l.density]);
  if (l.controls === 'pill') v['--ds-look-control-corner'] = '999px'; else if (typeof l.controls === 'number') v['--ds-look-control-corner'] = `${l.controls}px`;
  return v as CSSProperties;
};

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
  /**
   * The anchor knobs (R-046). Set the pane corner or the density and everything that depends on it follows,
   * so nesting and rhythm hold. Any single token can still be set by hand after it.
   */
  look?: EnvironmentLook;
}

export const Environment = forwardRef<HTMLDivElement, EnvironmentProps>(function Environment({ brightness = 'bright', material = 'glass', look, style, ...rest }, ref) {
  const own = useRef<HTMLDivElement | null>(null);
  // liquid gives each glass surface its own lens; every other material leaves the surfaces as they are
  useEffect(() => (material === 'liquid' && own.current ? enableLiquid(own.current) : undefined), [material]);
  const setRef = (node: HTMLDivElement | null) => {
    own.current = node;
    if (typeof ref === 'function') ref(node); else if (ref) ref.current = node;
  };
  return <div ref={setRef} data-environment={brightness} data-material={material === 'glass' ? undefined : material} data-look={look ? '' : undefined} style={look ? { ...lookStyle(look), ...style } : style} {...rest} />;
});
