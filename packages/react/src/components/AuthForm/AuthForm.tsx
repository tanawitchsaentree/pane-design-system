import { forwardRef, useId, type ReactNode } from 'react';
import { cx } from '../../cx';
import { Form, type FormError } from '../Form';
import { FormField } from '../FormField';
import { Input } from '../Input';
import { PasswordInput } from '../PasswordInput';
import { Button } from '../Button';
import styles from './AuthForm.module.css';
import { useMessages } from '../../i18n/context';

export interface AuthValues { email: string; password?: string; name?: string }

export interface AuthFormProps {
  /** `sign-in` (default) asks for email and password; `sign-up` adds a name and asks for a new password; `reset` asks only for the email. */
  mode?: 'sign-in' | 'sign-up' | 'reset';
  /** Called with the values on submit. Check them and pass any problems back in `errors`. */
  onSubmit: (values: AuthValues) => void;
  /** Problems after a submit, keyed by the field they belong to, `email`, `password` or `name`. They show in the summary and under each field. */
  errors?: Partial<Record<keyof AuthValues, string>>;
  /** Locks the button and says Signing in, while the request runs. */
  pending?: boolean;
  /** The heading; Sign in, Create an account or Reset your password by default. */
  title?: string;
  /** A line under the heading, such as the product's name or why an account is needed. */
  description?: ReactNode;
  /** Shown under the password field in sign-up, such as At least 12 characters. */
  passwordHint?: string;
  /** Adds a Forgot your password link under the password in sign-in. */
  onForgot?: () => void;
  /** Adds the line that switches between signing in and creating an account. */
  onSwitch?: () => void;
  /** Buttons for other ways in, such as Continue with Apple, shown under the form after a divider. */
  providers?: ReactNode;
  /** Extra class on the wrapper. */
  className?: string;
}


/** Sign in, sign up and reset, built from Form, FormField, Input and PasswordInput with the autocomplete
 *  names password managers need. Errors go to Form's summary and under each field; the one loud button
 *  is the submit, and other ways in sit under a divider so they never compete with it (P5). */
export const AuthForm = forwardRef<HTMLFormElement, AuthFormProps>(function AuthForm({ mode = 'sign-in', onSubmit, errors = {}, pending, title, description, passwordHint, onForgot, onSwitch, providers, className }, ref) {
  const id = useId(); const msg = useMessages(); const t = msg.auth[mode];
  const list: FormError[] = (['name', 'email', 'password'] as const).filter((k) => errors[k]).map((k) => ({ field: `${id}-${k}`, message: errors[k]! }));
  return (
    <div data-component="AuthForm" className={cx(styles.root, className)}>
      <div className={styles.head}>
        <h1 className={styles.title}>{title ?? t.title}</h1>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      <Form ref={ref} errors={list} onSubmit={(fd) => onSubmit({ email: String(fd.get('email') ?? ''), password: fd.get('password') != null ? String(fd.get('password')) : undefined, name: fd.get('name') != null ? String(fd.get('name')) : undefined })}
        actions={<Button type="submit" variant="light" disabled={pending} className={styles.submit}>{pending ? t.pending : t.button}</Button>}>
        {mode === 'sign-up' && <FormField id={`${id}-name`} label={msg.name} error={errors.name}><Input name="name" autoComplete="name" /></FormField>}
        <FormField id={`${id}-email`} label={msg.email} error={errors.email}><Input name="email" type="email" autoComplete={mode === 'sign-up' ? 'email' : 'username'} inputMode="email" spellCheck={false} /></FormField>
        {mode !== 'reset' && (
          <FormField id={`${id}-password`} label={msg.password} error={errors.password} help={mode === 'sign-up' ? passwordHint : undefined}>
            <PasswordInput name="password" autoComplete={mode === 'sign-up' ? 'new-password' : 'current-password'} />
          </FormField>
        )}
        {mode === 'sign-in' && onForgot && <button type="button" className={styles.link} onClick={onForgot}>{msg.forgotPassword}</button>}
      </Form>
      {providers && <><div className={styles.or} role="separator"><span>{msg.or}</span></div><div className={styles.providers}>{providers}</div></>}
      {onSwitch && <p className={styles.switch}>{t.switch} <button type="button" className={styles.link} onClick={onSwitch}>{t.switchAction}</button></p>}
    </div>
  );
});
