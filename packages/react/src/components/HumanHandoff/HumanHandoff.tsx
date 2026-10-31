import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../cx';
import { Button } from '../Button';
import { useMessages } from '../../i18n/context';
import styles from './HumanHandoff.module.css';

export type HandoffState = 'offer' | 'connecting' | 'connected' | 'returned';

export interface HumanHandoffProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** `offer` when the assistant suggests a person; `connecting` while the reader waits; `connected` once a person has taken over; `returned` when the person hands the chat back. */
  state: HandoffState;
  /** Who the reader will reach or is talking to, such as a nurse, or Nurse Ida Holm once connected. */
  who: string;
  /** Why a person is needed, in a line, such as This needs a clinician to review. */
  reason?: string;
  /** While connecting, where the reader is in the queue, already formatted, such as 2nd in line, about 3 min. */
  wait?: string;
  /** Their avatar once connected. */
  avatar?: ReactNode;
  /** Called by Talk to a person in the offer. */
  onAccept?: () => void;
  /** Called by Not now in the offer, or Cancel while connecting. */
  onDecline?: () => void;
}

/** The moment a conversation moves between an assistant and a person: the offer and why, the wait, who
 *  has taken over, and the hand back. It is a status region, so each change is announced once. */
export const HumanHandoff = forwardRef<HTMLDivElement, HumanHandoffProps>(function HumanHandoff({ state, who, reason, wait, avatar, onAccept, onDecline, className, ...rest }, ref) {
  const t = useMessages();
  const head = { offer: t.handoffOffer(who), connecting: t.handoffConnecting(who), connected: t.handoffConnected(who), returned: t.handoffReturned(who) }[state];
  return (
    <div ref={ref} role="status" data-component="HumanHandoff" data-state={state} className={cx(styles.root, className)} {...rest}>
      <div className={styles.line}>
        {state === 'connected' && avatar != null ? <span className={styles.avatar} aria-hidden="true">{avatar}</span>
          : <svg className={cx(styles.glyph, state === 'connecting' && styles.turning)} viewBox="0 0 24 24" aria-hidden="true">{state === 'connecting' ? <path d="M12 3.5a8.5 8.5 0 1 1-8.5 8.5" /> : <><circle cx="12" cy="8.5" r="3.5" /><path d="M5 19.5c1.2-3.4 3.8-5 7-5s5.8 1.6 7 5" /></>}</svg>}
        <div className={styles.text}>
          <p className={styles.title}>{head}</p>
          {state === 'offer' && reason && <p className={styles.meta}>{reason}</p>}
          {state === 'connecting' && wait && <p className={styles.meta}>{wait}</p>}
        </div>
      </div>
      {state === 'offer' && (onAccept || onDecline) && (
        <div className={styles.actions}>
          {onAccept && <Button size="sm" onClick={onAccept}>{t.talkToPerson}</Button>}
          {onDecline && <Button size="sm" variant="ghost" onClick={onDecline}>{t.notNow}</Button>}
        </div>
      )}
      {state === 'connecting' && onDecline && <div className={styles.actions}><Button size="sm" variant="ghost" onClick={onDecline}>{t.cancel}</Button></div>}
    </div>
  );
});
