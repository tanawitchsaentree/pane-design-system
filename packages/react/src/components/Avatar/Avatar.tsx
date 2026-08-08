'use client';

import { forwardRef, useState } from 'react';
import type { ComponentPropsWithoutRef, ElementRef } from 'react';
import type { AvatarSizeToken } from '../../types';
import styles from './Avatar.module.css';

export type AvatarShape = 'circle' | 'square';

type AvatarBaseProps = Omit<ComponentPropsWithoutRef<'span'>, 'children'>;

interface AvatarWithSrcProps extends AvatarBaseProps {
  /** Image URL. When provided, `alt` is required. */
  src: string;
  /** Required whenever `src` is set — describes the image for assistive tech. */
  alt: string;
  /** Initials (or short text) shown if `src` is omitted, or if the image fails to load. */
  fallback?: string;
}

interface AvatarWithoutSrcProps extends AvatarBaseProps {
  src?: undefined;
  alt?: string;
  fallback?: string;
}

export type AvatarProps = (AvatarWithSrcProps | AvatarWithoutSrcProps) & {
  /** `size.avatar.*` t-shirt scale — 24/32/40/48/64/96 (D-004). Default `'md'` (40). */
  size?: AvatarSizeToken;
  /** Default `'circle'`. */
  shape?: AvatarShape;
};

/**
 * Avatar — image with initials/fallback placeholder (D-004 avatar size scale). Marked
 * `"use client"` because it tracks image-load-error state to swap to the fallback (BLUEPRINT §7:
 * "use client" only where actual state/effect/event handling exists).
 * Anatomy: single root `span` — either an `img` (load succeeded) or a fallback `span` (no `src`,
 * or the image failed to load).
 * A11y: image case exposes the required `alt`; fallback-only case exposes `role="img"` +
 * `aria-label` (falls back to `fallback` text itself, or `alt` if that's all that's given) so a
 * screen reader still gets a name instead of reading raw initials as if they were a word.
 */
export const Avatar = forwardRef<ElementRef<'span'>, AvatarProps>(function Avatar(
  { src, alt, fallback, size = 'md', shape = 'circle', className, ...rest },
  ref,
) {
  const [imageFailed, setImageFailed] = useState(false);
  const classes = className ? `${styles.avatar} ${className}` : styles.avatar;
  const showImage = Boolean(src) && !imageFailed;

  return (
    <span ref={ref} className={classes} data-size={size} data-shape={shape} {...rest}>
      {showImage ? (
        <img
          className={styles.image}
          src={src}
          alt={alt ?? fallback ?? ''}
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span className={styles.fallback} role="img" aria-label={alt ?? fallback ?? 'Avatar'}>
          {fallback}
        </span>
      )}
    </span>
  );
});

Avatar.displayName = 'Avatar';
