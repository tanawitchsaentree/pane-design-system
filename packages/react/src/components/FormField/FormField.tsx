import { createContext, useContext, useId, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../cx';
import { Label } from '../Label';
import { HelperText } from '../HelperText';
import styles from './FormField.module.css';

// One field: its label above, the control, then help and error below (D-020). The ids that tie them
// together travel through context, so Input, Textarea and PinInput describe themselves without props.
export interface FieldContextValue { id: string; describedBy?: string; invalid: boolean; required: boolean; disabled: boolean }
const FieldContext = createContext<FieldContextValue | null>(null);
/** The surrounding FormField, if any. Controls read their id, description and state from it. */
export const useField = () => useContext(FieldContext);

export interface FormFieldProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Sets the control's id, so a Form's error summary can link to the field; one is made for you otherwise. */
  id?: string;
  /** The field's name, shown above the control and used as its accessible name. */
  label: ReactNode;
  /** Optional help shown under the control and read after the label. */
  help?: ReactNode;
  /** An error message. Setting it marks the control invalid and shows the error under it. */
  error?: ReactNode;
  /** A warning, for a value that is allowed but worth a second look, such as This will notify 2,000 people. It shows with the triangle glyph and the word Warning and does not mark the field invalid; an error wins over it. */
  warning?: ReactNode;
  /** Marks the field required. The label says (required) in words, never with a colour or an asterisk alone. */
  required?: boolean;
  /** Disables the control inside. */
  disabled?: boolean;
  /** The control, usually one Input, Textarea or PinInput. */
  children: ReactNode;
}

export function FormField({ id: fixedId, label, help, error, warning, required = false, disabled = false, className, children, ...rest }: FormFieldProps) {
  const auto = useId();
  const id = fixedId ?? auto;
  const helpId = help != null ? `${id}-help` : undefined;
  const errorId = error != null ? `${id}-error` : undefined;
  const warnId = error == null && warning != null ? `${id}-warning` : undefined;
  const describedBy = [errorId, warnId, helpId].filter(Boolean).join(' ') || undefined;
  return (
    <div data-component="FormField" className={cx(styles.root, className)} {...rest}>
      {/* the label's id also names a group control such as PinInput, whose label cannot point at one cell */}
      <Label id={`${id}-label`} htmlFor={id} required={required}>{label}</Label>
      <FieldContext.Provider value={{ id, describedBy, invalid: error != null, required, disabled }}>{children}</FieldContext.Provider>
      {error != null && <HelperText id={errorId} tone="error">{error}</HelperText>}
      {warnId && <HelperText id={warnId} tone="warning">{warning}</HelperText>}
      {help != null && <HelperText id={helpId}>{help}</HelperText>}
    </div>
  );
}
