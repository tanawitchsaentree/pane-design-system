import { forwardRef, useState, type ImgHTMLAttributes } from 'react';
import { cx } from '../../cx';
import styles from './Image.module.css';

export interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  /** Says what the image shows, or "" when it only decorates. */
  alt: string;
  /** The corner: `media` (default) inside a pane, `inner` for a full-bleed card image, `none`. */
  radius?: 'media' | 'inner' | 'none';
  /** `cover` (default) fills the box and crops; `contain` shows the whole image. */
  fit?: 'cover' | 'contain';
}

/** A picture with a corner from the scale, loaded lazily, that fades in when it arrives and shows the
 *  carve of the glass if it fails, never the browser's broken-image box. */
export const Image = forwardRef<HTMLImageElement, ImageProps>(function Image({ radius = 'media', fit = 'cover', loading = 'lazy', className, onLoad, onError, ...rest }, ref) {
  const [state, setState] = useState<'loading' | 'loaded' | 'error'>('loading');
  return (
    <img
      ref={ref}
      data-component="Image"
      data-state={state}
      loading={loading}
      decoding="async"
      className={cx(styles.root, styles[radius], styles[fit], className)}
      onLoad={(e) => { setState('loaded'); onLoad?.(e); }}
      onError={(e) => { setState('error'); onError?.(e); }}
      {...rest}
    />
  );
});
