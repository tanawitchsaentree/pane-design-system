import { forwardRef, useState } from 'react';
import { Input, type InputProps } from '../Input';
import { InputGroup } from '../InputGroup';
import { IconButton } from '../IconButton';
import styles from './PasswordInput.module.css';
import { useMessages } from '../../i18n/context';

export interface PasswordInputProps extends Omit<InputProps, 'type' | 'size'> {
  /** `current-password` (default) for signing in; `new-password` when the reader is choosing one, so managers offer a strong one. */
  autoComplete?: 'current-password' | 'new-password';
  /** The words on the show button for screen readers; Show password by default. */
  showLabel?: string;
}

/** A password field with a button at its end that shows and hides what was typed. The button says its
 *  state with aria-pressed and swaps an open eye for a closed one, so the state reads by shape. Showing
 *  never survives a submit: the field goes back to hidden when the form is sent. */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput({ autoComplete = 'current-password', showLabel: showLabelIn, className, ...rest }, ref) {
  const t = useMessages();
  const showLabel = showLabelIn ?? t.showPassword;
  const [shown, setShown] = useState(false);
  return (
    <InputGroup data-component="PasswordInput" className={className} onSubmitCapture={() => setShown(false)}
      end={
        <IconButton variant="ghost" aria-label={showLabel} aria-pressed={shown} onClick={() => setShown((s) => !s)}>
          <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.eye}>
            <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="3" />
            {shown ? null : <path d="M4 20 20 4" />}
          </svg>
        </IconButton>
      }>
      <Input ref={ref} type={shown ? 'text' : 'password'} autoComplete={autoComplete} spellCheck={false} autoCapitalize="off" {...rest} />
    </InputGroup>
  );
});
