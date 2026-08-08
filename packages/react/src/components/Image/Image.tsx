import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ElementRef } from 'react';
import { AspectRatio } from '../AspectRatio/AspectRatio';
import type { AspectRatioProps } from '../AspectRatio/AspectRatio';
import type { RadiusToken } from '../../types';
import styles from './Image.module.css';

export interface ImageProps extends ComponentPropsWithoutRef<'img'> {
  src: string;
  /** Required — describes the image for assistive tech (never defaulted/omitted). */
  alt: string;
  /** Constrains the image to a fixed ratio via Wave 1's `AspectRatio` (D-012) instead of relying
   * on the image's intrinsic dimensions. Omit to let the image size itself normally. */
  ratio?: AspectRatioProps['ratio'];
  /** `object-fit`. Default `'cover'`. */
  fit?: 'cover' | 'contain';
  /** Optional corner rounding (D-008 soft-rounded scale). */
  radius?: RadiusToken;
  /** Default `'lazy'`, matching native browser lazy-loading. */
  loading?: 'lazy' | 'eager';
}

/**
 * Image — `<img>` wrapper with optional fixed-ratio framing (composes Wave 1's `AspectRatio`,
 * D-012) and D-008-safe corner rounding (no decorative shadow anywhere in this file). Ships no
 * client-side error/fallback state of its own — that concern belongs to `Avatar`, which is the
 * component in this system meant for "picture that might fail to load and needs a fallback";
 * Image is the plain-content case (article hero, gallery tile, etc.).
 * Anatomy: `AspectRatio` root (only when `ratio` is set) wrapping a single `img` element, or just
 * the `img` element alone otherwise.
 */
export const Image = forwardRef<ElementRef<'img'>, ImageProps>(function Image(
  { src, alt, ratio, fit = 'cover', radius, loading = 'lazy', className, style, ...rest },
  ref,
) {
  const classes = className ? `${styles.image} ${className}` : styles.image;
  const img = (
    <img
      ref={ref}
      src={src}
      alt={alt}
      loading={loading}
      className={classes}
      data-fit={fit}
      data-radius={radius}
      style={style}
      {...rest}
    />
  );

  if (ratio === undefined) return img;

  return <AspectRatio ratio={ratio}>{img}</AspectRatio>;
});

Image.displayName = 'Image';
