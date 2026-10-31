import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../cx';
import { useMessages } from '../../i18n/context';
import styles from './ChatMessage.module.css';

export interface ChatMessageProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** `user` is the reader's own turn, on chosen glass at the end edge. `assistant` is the answer, plain text on the pane at the start, because the answer is the content. */
  sender: 'user' | 'assistant';
  /** Who spoke, read before the message, such as You or Lumen. */
  author: string;
  /** The message. Markdown, code and citations are rendered by the product and passed in. */
  children: ReactNode;
  /** When it was sent, already formatted, such as 09:41. */
  time?: string;
  /** Set while the answer is still arriving. A caret follows the text and the message is marked busy, so screen readers hear it once it is complete. */
  streaming?: boolean;
  /** A small avatar or glyph before an assistant message. */
  avatar?: ReactNode;
  /** Quiet actions under the message, such as Copy and Retry, usually ghost IconButtons. */
  actions?: ReactNode;
  /** Tool calls and steps the assistant took, shown above the answer, usually ChatToolCall rows. */
  steps?: ReactNode;
}

/** One turn of a conversation. The reader's turns are chosen glass at the end edge; the assistant's
 *  answer is text straight on the pane, with its steps above it and quiet actions under it. */
export const ChatMessage = forwardRef<HTMLElement, ChatMessageProps>(function ChatMessage({ sender, author, children, time, streaming, avatar, actions, steps, className, ...rest }, ref) {
  const t = useMessages();
  return (
    <article ref={ref} data-component="ChatMessage" data-sender={sender} aria-busy={streaming || undefined} aria-label={t.messageFrom(author)} className={cx(styles.root, styles[sender], className)} {...rest}>
      {sender === 'assistant' && avatar != null && <span className={styles.avatar} aria-hidden="true">{avatar}</span>}
      <div className={styles.body}>
        <header className={styles.head}><span className={styles.author}>{author}</span>{time && <time className={styles.time}>{time}</time>}</header>
        {steps != null && <div className={styles.steps}>{steps}</div>}
        <div className={styles.text}>{children}{streaming && <span className={styles.caret} aria-hidden="true" />}</div>
        {actions != null && !streaming && <div className={styles.actions}>{actions}</div>}
      </div>
    </article>
  );
});

export interface ChatToolCallProps extends Omit<HTMLAttributes<HTMLDetailsElement>, 'title'> {
  /** What the assistant did, as a past-tense line, such as Searched your records. */
  title: string;
  /** `running` turns its mark while it works; `done` and `failed` take the check and the octagon with their word. */
  state?: 'running' | 'done' | 'failed';
  /** A short result line, such as 3 visits found, and anything the reader may open to see. */
  children?: ReactNode;
}

const MARK = {
  done: <><circle cx="12" cy="12" r="8.5" /><path d="M8.5 12.3l2.4 2.4 4.6-5" /></>,
  failed: <><path d="M8.6 3.8h6.8l4.8 4.8v6.8l-4.8 4.8H8.6l-4.8-4.8V8.6z" /><path d="M12 8v5M12 16v.01" /></>,
  running: <path d="M12 3.5a8.5 8.5 0 1 1-8.5 8.5" />,
};

/** One step an assistant took, such as a search or a lookup: a line with its state, which opens to show the detail. */
export function ChatToolCall({ title, state = 'done', children, className, ...rest }: ChatToolCallProps) {
  const t = useMessages();
  const word = { running: t.working, done: t.done, failed: t.failed }[state];
  return (
    <details data-component="ChatToolCall" data-state={state} className={cx(styles.tool, className)} {...rest}>
      <summary className={styles.toolHead}>
        <svg className={cx(styles.mark, styles[state])} viewBox="0 0 24 24" aria-hidden="true">{MARK[state]}</svg>
        <span className={styles.toolTitle}><span className={styles.sr}>{word}: </span>{title}</span>
      </summary>
      {children != null && <div className={styles.toolBody}>{children}</div>}
    </details>
  );
}
