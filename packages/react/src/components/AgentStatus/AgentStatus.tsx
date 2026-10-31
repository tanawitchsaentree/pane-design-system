import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../cx';
import { useMessages } from '../../i18n/context';
import styles from './AgentStatus.module.css';

export type AgentState = 'thinking' | 'working' | 'waiting' | 'done' | 'failed';

export interface AgentStep { label: string; state: 'done' | 'current' | 'upcoming' | 'failed' }

export interface AgentStatusProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Where the agent is. `thinking` before it acts, `working` through steps, `waiting` when it needs the reader, `done`, or `failed`. Each has its own glyph and word, so the state never rests on colour. */
  state: AgentState;
  /** What it is doing or did, in a line, such as Checking your last three visits. */
  title: string;
  /** The steps, when it works through several; the current one is marked and read. */
  steps?: AgentStep[];
  /** How long it has been at it, already formatted, such as 12 s. */
  elapsed?: string;
  /** The one thing the reader can do now, such as Answer while waiting, Retry after a failure or Stop while working. */
  action?: ReactNode;
}

const GLYPH: Record<AgentState, ReactNode> = {
  thinking: <><circle cx="7" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="17" cy="12" r="1.6" /></>,
  working: <path d="M12 3.5a8.5 8.5 0 1 1-8.5 8.5" />,
  waiting: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
  done: <><circle cx="12" cy="12" r="8.5" /><path d="M8.5 12.3l2.4 2.4 4.6-5" /></>,
  failed: <><path d="M8.6 3.8h6.8l4.8 4.8v6.8l-4.8 4.8H8.6l-4.8-4.8V8.6z" /><path d="M12 8v5M12 16v.01" /></>,
};

/** What an AI agent is doing, in one quiet row on the pane: a glyph and a word for its state, the task in
 *  a line, its steps when it has several, and the one thing the reader can do now. It is a status region,
 *  so a change of state is announced once, politely. */
export const AgentStatus = forwardRef<HTMLDivElement, AgentStatusProps>(function AgentStatus({ state, title, steps, elapsed, action, className, ...rest }, ref) {
  const t = useMessages();
  const word = { thinking: t.thinking, working: t.working, waiting: t.waitingOnYou, done: t.done, failed: t.failed }[state];
  const at = steps?.findIndex((s) => s.state === 'current') ?? -1;
  return (
    <div ref={ref} role="status" data-component="AgentStatus" data-state={state} className={cx(styles.root, styles[state], className)} {...rest}>
      <div className={styles.line}>
        <svg className={styles.glyph} viewBox="0 0 24 24" aria-hidden="true">{GLYPH[state]}</svg>
        <div className={styles.text}>
          <p className={styles.title}><span className={styles.word}>{word}</span> <span>{title}</span></p>
          {(elapsed || (steps && at >= 0)) && <p className={styles.meta}>{[steps && at >= 0 ? t.stepOf(at + 1, steps.length) : null, elapsed].filter(Boolean).join(' · ')}</p>}
        </div>
        {action != null && <div className={styles.action}>{action}</div>}
      </div>
      {steps && steps.length > 0 && (
        <ol className={styles.steps}>
          {steps.map((s, i) => <li key={i} className={styles.step} data-state={s.state} aria-current={s.state === 'current' ? 'step' : undefined}><span className={styles.dot} aria-hidden="true" /><span>{s.label}</span>{s.state === 'failed' && <span className={styles.sr}> ({t.failed})</span>}</li>)}
        </ol>
      )}
    </div>
  );
});
