import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../cx';
import styles from './Card.module.css';

export type CardVariant = 'glass' | 'inset';

export interface CardProps extends HTMLAttributes<HTMLElement> {
  /** `glass` = a floating pane. `inset` = content nested inside a pane (no second glass layer, top divider). */
  variant?: CardVariant;
  /** Rendered element. Use `article` for self-contained content, `section` for a titled region, `aside` for complementary content and `header` for a page head. */
  as?: 'article' | 'section' | 'aside' | 'header' | 'div';
}

export const Card = forwardRef<HTMLElement, CardProps>(function Card({ variant = 'glass', as: Tag = 'article', className, ...rest }, ref) {
  // data-pane-card is a stable hook (class names are hashed) for tests and for consumers' own CSS
  return <Tag ref={ref as never} data-pane-card={variant} data-component="Card" className={cx(styles.root, styles[variant], className)} {...rest} />;
});

export interface CardCoverProps extends HTMLAttributes<HTMLDivElement> {
  /** Image URL; omit for a decorative gradient placeholder. */
  src?: string;
}

/** Full-bleed image strip at the top of a glass Card. Decorative — put meaning in text, not here. */
export const CardCover = forwardRef<HTMLDivElement, CardCoverProps>(function CardCover({ src, className, style, ...rest }, ref) {
  return <div ref={ref} className={cx(styles.cover, className)} style={src ? { ...style, backgroundImage: `url(${src})` } : style} {...rest} />;
});
