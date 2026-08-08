import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Fieldset } from './Fieldset';
import { Radio } from '../Radio/Radio';

describe('Fieldset', () => {
  it('renders a native fieldset with a legend', () => {
    render(
      <Fieldset legend="Shipping method">
        <Radio aria-label="Standard" name="shipping" value="standard" />
      </Fieldset>,
    );
    expect(screen.getByRole('group', { name: 'Shipping method' })).toBeInTheDocument();
  });

  it('disables every nested control via native fieldset disabled cascade', () => {
    render(
      <Fieldset legend="Shipping method" disabled>
        <Radio aria-label="Standard" name="shipping-disabled" value="standard" />
        <Radio aria-label="Express" name="shipping-disabled" value="express" />
      </Fieldset>,
    );
    expect(screen.getByRole('radio', { name: 'Standard' })).toBeDisabled();
    expect(screen.getByRole('radio', { name: 'Express' })).toBeDisabled();
  });

  it('does not disable children by default', () => {
    render(
      <Fieldset legend="Shipping method">
        <Radio aria-label="Standard" name="shipping-enabled" value="standard" />
      </Fieldset>,
    );
    expect(screen.getByRole('radio', { name: 'Standard' })).not.toBeDisabled();
  });

  it('forwards ref to the underlying fieldset element', () => {
    const ref = createRef<HTMLFieldSetElement>();
    render(<Fieldset legend="Ref fieldset" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLFieldSetElement);
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <Fieldset legend="Accessible group">
        <Radio aria-label="Option" name="a11y-fieldset" value="option" />
      </Fieldset>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
