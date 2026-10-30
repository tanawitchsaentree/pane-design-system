import { forwardRef, type ReactNode } from 'react';
import * as RA from '@radix-ui/react-accordion';
import { cx } from '../../cx';
import styles from './Accordion.module.css';

/** One section. `title` can be live content, such as a heading with a timer; it stays inside the real heading and the button. */
export interface AccordionItem { value: string; title: ReactNode; content: ReactNode; disabled?: boolean }

export interface AccordionProps {
  /** The sections, each a heading that opens its content. */
  items: AccordionItem[];
  /** `single` (default) keeps one open at a time; `multiple` lets several stay open. */
  type?: 'single' | 'multiple';
  /** The section open at the start (single), or the sections (multiple). */
  defaultValue?: string | string[];
  /** The heading level of each section title, from the page outline. Defaults to 3. */
  headingLevel?: 2 | 3 | 4;
  /** Extra class on the root. */
  className?: string;
}

/** Sections that open and close under their headings, for long pages of answers or settings: grooves
 *  between them, a chevron that turns, and content that settles in. Each title is a real heading. */
export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(function Accordion({ items, type = 'single', defaultValue, headingLevel = 3, className }, ref) {
  const Heading = `h${headingLevel}` as 'h3';
  const rootProps = type === 'multiple'
    ? ({ type: 'multiple', defaultValue: [].concat((defaultValue ?? []) as never) } as const)
    : ({ type: 'single', collapsible: true, defaultValue: defaultValue as string | undefined } as const);
  return (
    <RA.Root ref={ref} {...rootProps} data-component="Accordion" className={cx(styles.root, className)}>
      {items.map((it) => (
        <RA.Item key={it.value} value={it.value} disabled={it.disabled} className={styles.item}>
          <RA.Header asChild><Heading className={styles.heading}>
            <RA.Trigger className={styles.trigger}>{it.title}<svg className={styles.chevron} viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10l5 5 5-5" /></svg></RA.Trigger>
          </Heading></RA.Header>
          <RA.Content className={styles.content}><div className={styles.inner}>{it.content}</div></RA.Content>
        </RA.Item>
      ))}
    </RA.Root>
  );
});
