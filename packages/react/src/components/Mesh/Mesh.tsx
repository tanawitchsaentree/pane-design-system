import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';
import { cx } from '../../cx';
import styles from './Mesh.module.css';

// A mesh gradient (D-029): four colour pools placed on their own and melted together by a blur, on a
// pale ground. A scene, a cover, an icon or an illustration, never a control's fill: the colour is the
// world's or the product's, not the system's (P1). Presets ship measured; `colors` brings a brand's own.

export type MeshPreset = 'aurora' | 'ember' | 'tide' | 'dusk';

export interface MeshProps extends HTMLAttributes<HTMLDivElement> {
  /** A measured colour set. `aurora` (default) is peach and coral over violet; `ember` warm; `tide` cool; `dusk` evening. */
  preset?: MeshPreset;
  /** Your own four pools, top left, top right, low and bottom left, as any CSS colour. Overrides the preset. */
  colors?: [string, string, string, string];
  /** The ground under the pools. Overrides the preset's. */
  base?: string;
  /** Turns the pools around the centre, in degrees, to move where the light seems to come from. */
  rotate?: number;
  /** Lights what is under the mesh in its own colours: an ambient shadow, for a mesh object such as an icon. */
  glow?: boolean;
  /** Names the mesh for assistive technology when it carries meaning (an illustration). Leave it out when it is decoration. */
  label?: string;
}

export const Mesh = forwardRef<HTMLDivElement, MeshProps>(function Mesh(
  { preset = 'aurora', colors, base, rotate, glow, label, className, style, children, ...rest },
  ref,
) {
  const vars = {
    ...(colors ? { '--mesh-a': colors[0], '--mesh-b': colors[1], '--mesh-c': colors[2], '--mesh-d': colors[3] } : {}),
    ...(base ? { '--mesh-base': base } : {}),
    ...(rotate != null ? { '--mesh-rotate': `${rotate}deg` } : {}),
  } as CSSProperties;
  const decorative = !label;
  return (
    <div
      ref={ref}
      data-component="Mesh"
      data-preset={preset}
      className={cx(styles.root, styles[preset], className)}
      style={{ ...vars, ...style }}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={decorative && children == null ? true : undefined}
      {...rest}
    >
      {glow && <span className={styles.glow} aria-hidden="true" />}
      <span className={styles.paint} aria-hidden="true" />
      {children}
    </div>
  );
});
