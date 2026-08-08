import { forwardRef } from 'react';
import type { CSSProperties, ElementRef } from 'react';
import { Box } from '../Box/Box';
import type { BoxProps } from '../Box/Box';
import styles from './AspectRatio.module.css';

export type AspectRatioPreset = 'square' | 'video' | 'photo' | 'portrait' | 'golden';

export interface AspectRatioProps extends BoxProps {
  /**
   * Preset name (bound to `ratio.*` tokens: square=1, video=16/9, photo=4/3, portrait=3/4,
   * golden=1.618) or an arbitrary number (width/height) for cases the token scale doesn't cover.
   */
  ratio: AspectRatioPreset | number;
}

const isPreset = (ratio: AspectRatioPreset | number): ratio is AspectRatioPreset => typeof ratio === 'string';

/**
 * AspectRatio — constrains children to a fixed width/height ratio, extending Box (D-012).
 * Anatomy: root element + single absolutely-positioned content layer filling it.
 */
export const AspectRatio = forwardRef<ElementRef<'div'>, AspectRatioProps>(function AspectRatio(
  { ratio, className, style, ...rest },
  ref,
) {
  const classes = className ? `${styles.aspectRatio} ${className}` : styles.aspectRatio;
  const preset = isPreset(ratio) ? ratio : undefined;
  // Numeric ratio is a consumer-supplied escape hatch (like the `style` prop elsewhere) — not a
  // token the system owns, so it is applied the same way any other inline override is.
  const numericStyle: CSSProperties = preset ? {} : { aspectRatio: String(ratio) };

  return (
    <Box
      ref={ref}
      className={classes}
      data-ratio={preset}
      style={{ ...numericStyle, ...style }}
      {...rest}
    />
  );
});

AspectRatio.displayName = 'AspectRatio';
