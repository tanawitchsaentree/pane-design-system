import { Children, forwardRef, useEffect, useRef, useState, type ReactNode } from 'react';
import { cx } from '../../cx';
import { IconButton } from '../IconButton';
import styles from './Carousel.module.css';
import { useMessages } from '../../i18n/context';

export interface CarouselProps {
  /** Names the carousel, such as Featured prints; it is a region with this name. */
  label: string;
  /** The slides, one child each; each is a group read as Slide 2 of 5. */
  children: ReactNode;
  /** How many slides show at once on a wide pane; 1 by default. It drops to one on a narrow pane. */
  perView?: 1 | 2 | 3;
  /** Extra class on the wrapper. */
  className?: string;
}

/** Slides in a row that scroll and snap, with previous and next buttons and a row of dots that says where
 *  you are. It never moves by itself (P4: nothing moves that the reader did not move), the slides stay in
 *  the page for screen readers, and a swipe, a scroll or the buttons all do the same thing. */
export const Carousel = forwardRef<HTMLDivElement, CarouselProps>(function Carousel({ label, children, perView = 1, className }, ref) {
  const t = useMessages();
  const slides = Children.toArray(children);
  const track = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState(0);
  useEffect(() => {
    const el = track.current; if (!el) return;
    const io = new IntersectionObserver((es) => { for (const e of es) if (e.isIntersecting && e.intersectionRatio > 0.6) setAt(Number((e.target as HTMLElement).dataset.i)); }, { root: el, threshold: [0.6] });
    el.querySelectorAll('[data-i]').forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [slides.length]);
  const to = (i: number) => { const s = track.current?.querySelector<HTMLElement>(`[data-i="${i}"]`); s?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest', inline: 'start' }); };
  return (
    <section ref={ref} data-component="Carousel" aria-roledescription={t.carousel} aria-label={label} className={cx(styles.root, className)}>
      <div ref={track} className={cx(styles.track, styles[`v${perView}`])} tabIndex={0} aria-label={t.slides(label)}>
        {slides.map((s, i) => <div key={i} data-i={i} role="group" aria-roledescription={t.slide} aria-label={t.of(i + 1, slides.length)} className={styles.slide}>{s}</div>)}
      </div>
      <div className={styles.controls}>
        <IconButton aria-label={t.previousSlide} disabled={at === 0} onClick={() => to(at - 1)}><svg viewBox="0 0 24 24" aria-hidden="true" className={styles.chev}><path d="M14.5 6 8.5 12l6 6" /></svg></IconButton>
        <div className={styles.dots} aria-hidden="true">{slides.map((_, i) => <span key={i} className={cx(styles.dot, i === at && styles.on)} />)}</div>
        <IconButton aria-label={t.nextSlide} disabled={at >= slides.length - 1} onClick={() => to(at + 1)}><svg viewBox="0 0 24 24" aria-hidden="true" className={styles.chev}><path d="M9.5 6l6 6-6 6" /></svg></IconButton>
        <span className={styles.count} aria-live="polite">{t.of(at + 1, slides.length)}</span>
      </div>
    </section>
  );
});
