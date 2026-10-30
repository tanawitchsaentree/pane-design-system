import { Fragment, forwardRef, type ReactNode } from 'react';
import * as RD from '@radix-ui/react-dialog';
import { cx } from '../../cx';
import { Card } from '../Card';
import styles from './ActionSheet.module.css';
import { useMessages } from '../../i18n/context';

export interface ActionSheetAction {
  /** What the action does, as a verb: Share, Save to Files, Delete. */
  label: string;
  /** Called when it is chosen; the sheet closes afterwards. */
  onSelect: () => void;
  /** `critical` for an action that destroys something; it is placed last. */
  tone?: 'default' | 'critical';
  /** An icon before the label. */
  icon?: ReactNode;
}

export interface ActionSheetProps {
  /** The control that opens it. */
  trigger?: ReactNode;
  /** A short title naming what the actions apply to. */
  title: ReactNode;
  /** A sentence under the title, for example the consequence of the critical action. */
  description?: ReactNode;
  /** The actions, most used first. */
  actions: ActionSheetAction[];
  /** The label of the button that closes without acting. Defaults to Cancel. */
  cancelLabel?: string;
  /** Controlled open state. */
  open?: boolean;
  /** Starting state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when it opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Draws it in place, open and not modal, inside its parent: for documentation, previews and screenshots, never in a product flow. */
  preview?: boolean;
}

/** A short list of actions that rises from the bottom over a dimmed scene, with Cancel set apart,
 *  for choosing what to do with one thing on a phone. */
export const ActionSheet = forwardRef<HTMLElement, ActionSheetProps>(function ActionSheet({ trigger, title, description, actions, cancelLabel: cancelLabelIn, open, defaultOpen, onOpenChange, preview }, ref) {
  const t = useMessages();
  const cancelLabel = cancelLabelIn ?? t.cancel;
  const Portal = preview ? Fragment : RD.Portal;
  return (
    <RD.Root open={preview ? true : open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} modal={!preview}>
      {trigger != null && <RD.Trigger asChild>{trigger}</RD.Trigger>}
      <Portal>
        {!preview && <RD.Overlay className={styles.scrim} />}
        <RD.Content className={cx(styles.wrap, preview && styles.preview)} data-component="ActionSheet">
          <Card ref={ref} as="section" level={3} className={styles.group}>
            <div className={styles.head}>
              <RD.Title className={styles.title}>{title}</RD.Title>
              {description != null && <RD.Description className={styles.description}>{description}</RD.Description>}
            </div>
            <div className={styles.list} role="group" aria-label={t.actions}>
              {actions.map((a) => (
                <RD.Close key={a.label} className={cx(styles.action, a.tone === 'critical' && styles.critical)} onClick={a.onSelect}>
                  {a.icon != null && <span className={styles.icon} aria-hidden="true">{a.icon}</span>}{a.label}
                </RD.Close>
              ))}
            </div>
          </Card>
          <RD.Close asChild><Card as="div" level={3} className={styles.cancelPane}><button type="button" className={styles.cancel}>{cancelLabel}</button></Card></RD.Close>
        </RD.Content>
      </Portal>
    </RD.Root>
  );
});
