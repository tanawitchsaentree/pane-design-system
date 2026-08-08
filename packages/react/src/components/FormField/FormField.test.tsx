import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { FormField } from './FormField';
import { Input } from '../Input/Input';

describe('FormField', () => {
  it('auto-generates an id and wires Label htmlFor to the control', () => {
    render(
      <FormField label="Email">
        <Input />
      </FormField>,
    );
    const input = screen.getByLabelText('Email');
    expect(input.tagName).toBe('INPUT');
  });

  it('wires aria-describedby from the control to the helper text', () => {
    render(
      <FormField label="Password" helperText="Must be at least 8 characters">
        <Input type="password" />
      </FormField>,
    );
    const input = screen.getByLabelText('Password');
    const describedById = input.getAttribute('aria-describedby');
    expect(describedById).toBeTruthy();
    const helper = document.getElementById(describedById as string);
    expect(helper).toHaveTextContent('Must be at least 8 characters');
  });

  it('does not set aria-describedby when there is no helperText', () => {
    render(
      <FormField label="Nickname">
        <Input />
      </FormField>,
    );
    expect(screen.getByLabelText('Nickname')).not.toHaveAttribute('aria-describedby');
  });

  it('sets aria-invalid and required on the control, and shows the required indicator', () => {
    render(
      <FormField label="Email" required invalid helperText="Enter a valid email">
        <Input />
      </FormField>,
    );
    const input = screen.getByLabelText(/Email/);
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('required');
    expect(screen.getByText('(required)', { exact: false })).toBeInTheDocument();
  });

  it('renders helperText with tone=error when invalid', () => {
    render(
      <FormField label="Email" invalid helperText="Invalid email">
        <Input />
      </FormField>,
    );
    const describedById = screen.getByLabelText('Email').getAttribute('aria-describedby');
    const helper = document.getElementById(describedById as string);
    expect(helper).toHaveAttribute('data-tone', 'error');
  });

  it('uses a caller-provided id instead of generating one when given', () => {
    render(
      <FormField label="Custom id" id="custom-field-id">
        <Input />
      </FormField>,
    );
    expect(screen.getByLabelText('Custom id')).toHaveAttribute('id', 'custom-field-id');
  });

  it('forwards ref to the underlying root div element', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <FormField label="Ref field" ref={ref}>
        <Input />
      </FormField>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <FormField label="Accessible field" helperText="Helper copy" required>
        <Input />
      </FormField>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
