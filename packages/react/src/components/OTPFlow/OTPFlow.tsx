import { forwardRef, useEffect, useId, useState } from 'react';
import { cx } from '../../cx';
import { PinInput } from '../PinInput';
import { Button } from '../Button';
import { Spinner } from '../Spinner';
import styles from './OTPFlow.module.css';
import { useMessages } from '../../i18n/context';

export interface OTPFlowProps {
  /** Where the code went, already masked, such as •••• 4821 or m•••@lind.no. It is said in the first line. */
  destination: string;
  /** Number of characters in the code; 6 by default. */
  length?: number;
  /** Checks a full code; return or resolve `true` when it is right. While it runs the cells are locked and a spinner says Checking. */
  onVerify: (code: string) => boolean | Promise<boolean>;
  /** Sends a new code. The resend button waits `resendAfter` seconds before it can be pressed again. */
  onResend?: () => void;
  /** Seconds before a new code can be asked for; 30 by default. */
  resendAfter?: number;
  /** Extra class on the wrapper. */
  className?: string;
}

/** The whole one-time-code step: where the code went, PinInput, a check that runs once the last cell is
 *  filled, the error in words when it is wrong, and a resend button that counts down. Status is said in
 *  text and announced politely, never shown by a colour alone (P6). */
export const OTPFlow = forwardRef<HTMLDivElement, OTPFlowProps>(function OTPFlow({ destination, length = 6, onVerify, onResend, resendAfter = 30, className }, ref) {
  const t = useMessages();
  const id = useId();
  const [code, setCode] = useState('');
  const [state, setState] = useState<'idle' | 'checking' | 'wrong' | 'right'>('idle');
  const [wait, setWait] = useState(resendAfter);
  useEffect(() => { if (wait <= 0) return; const t = setTimeout(() => setWait((w) => w - 1), 1000); return () => clearTimeout(t); }, [wait]);
  const verify = async (c: string) => {
    setState('checking');
    const ok = await onVerify(c);
    setState(ok ? 'right' : 'wrong');
    if (!ok) setCode('');
  };
  const status = state === 'checking' ? t.otpChecking : state === 'wrong' ? t.otpWrong : state === 'right' ? t.otpAccepted : '';
  const [leadA, , leadC] = t.otpLead(length, destination);
  return (
    <div ref={ref} data-component="OTPFlow" className={cx(styles.root, className)}>
      <p id={`${id}-to`} className={styles.lead}>{leadA}<span className={styles.to}>{destination}</span>{leadC}</p>
      <PinInput aria-label={t.verificationCode} length={length} value={code} invalid={state === 'wrong'} disabled={state === 'checking' || state === 'right'}
        onValueChange={(v) => { setCode(v); if (state === 'wrong') setState('idle'); }} onComplete={verify} />
      <p className={cx(styles.status, state === 'wrong' && styles.wrong)} role="status">
        {state === 'checking' && <Spinner size="sm" aria-hidden="true" />}
        {state === 'wrong' && <svg viewBox="0 0 16 16" aria-hidden="true" className={styles.glyph}><path d="M8 1.5 14.5 8 8 14.5 1.5 8Z" /></svg>}
        {status}
      </p>
      {onResend && state !== 'right' && (
        <div className={styles.resend}>
          <Button variant="glass" size="sm" disabled={wait > 0} onClick={() => { onResend(); setWait(resendAfter); setCode(''); setState('idle'); }}>{t.otpSendNew}</Button>
          {wait > 0 && <span className={styles.wait} aria-live="off">{t.otpIn(`${Math.floor(wait / 60)}:${String(wait % 60).padStart(2, '0')}`)}</span>}
        </div>
      )}
    </div>
  );
});
