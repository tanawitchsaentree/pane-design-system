import { useId, type ReactNode } from 'react';
import * as RP from '@radix-ui/react-popover';
import { cx } from '../../cx';
import { Card } from '../Card';
import { useMessages } from '../../i18n/context';
import styles from './Citation.module.css';

export interface CitationProps {
  /** The number shown in the text, such as 1. */
  index: number;
  /** The source's title, such as Blood test, 12 March. */
  title: string;
  /** Where it comes from, such as Lab results or a site name. */
  source?: string;
  /** The passage the claim rests on, quoted. */
  quote?: ReactNode;
  /** Opens the source; the card's Open source link goes here. */
  href?: string;
  /** How sure the answer is that this source says it, such as a ConfidenceChip. */
  confidence?: ReactNode;
}

/** A numbered mark after a claim (an inline target, 24px by the WCAG 2.5.8 inline exception, E-003) in an answer that says where it came from. Pressing or focusing it opens a
 *  small card with the source's title, the passage and a link, so a reader can check a claim before acting
 *  on it. The mark is a button whose name says the source in words. */
export function Citation({ index, title, source, quote, href, confidence }: CitationProps) {
  const t = useMessages();
  const id = useId();
  return (
    <RP.Root>
      <RP.Trigger asChild>
        <button type="button" data-component="Citation" data-touch-exempt="" className={styles.mark} aria-label={t.sourceOf(index, title)} aria-describedby={`${id}-n`}>
          <span id={`${id}-n`} aria-hidden="true">{index}</span>
        </button>
      </RP.Trigger>
      <RP.Portal>
        <RP.Content asChild side="top" align="center" sideOffset={6} collisionPadding={12}>
          <Card as="section" level={4} aria-label={t.sourceOf(index, title)} className={styles.pop}>
            <p className={styles.title}>{title}</p>
            {source && <p className={styles.source}>{source}</p>}
            {quote != null && <blockquote className={styles.quote}>{quote}</blockquote>}
            {(href || confidence != null) && <div className={styles.foot}>{confidence}{href && <a className={cx(styles.link)} href={href} target="_blank" rel="noopener">{t.openSource} <span className={styles.sr}>{t.opensInNewTab}</span></a>}</div>}
          </Card>
        </RP.Content>
      </RP.Portal>
    </RP.Root>
  );
}
