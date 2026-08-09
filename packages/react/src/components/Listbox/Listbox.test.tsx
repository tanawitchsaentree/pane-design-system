import { createRef, useState } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import type { Selection } from '@react-types/shared';
import { Listbox } from './Listbox';

// Honesty Rule (component-engineer.md): jsdom has no real layout/scroll, so it cannot prove
// roving-tabindex-after-Arrow-key, Home/End jump, typeahead, or scroll-into-view — those are
// UNVERIFIED here on purpose and instead proven by packages/conformance/specs/w5-listbox.spec.ts
// (real Chromium/WebKit/Firefox via Playwright). What jsdom CAN prove and is asserted below:
// role=listbox/option wiring, aria-selected sync on click, controlled/uncontrolled selection,
// disabledKeys blocking selection, initial roving-tabindex distribution (a render-time DOM
// attribute, not a post-Arrow-key focus movement), forwardRef, and axe.

const items = ['Apple', 'Banana', 'Cherry'];

function BasicListbox(props: Partial<React.ComponentProps<typeof Listbox>> = {}) {
  return (
    <Listbox aria-label="Fruit" {...props}>
      {items.map((fruit) => (
        <Listbox.Item key={fruit}>{fruit}</Listbox.Item>
      ))}
    </Listbox>
  );
}

describe('Listbox', () => {
  it('renders role=listbox with the given aria-label, containing role=option children', () => {
    render(<BasicListbox />);
    const listbox = screen.getByRole('listbox', { name: 'Fruit' });
    const options = within(listbox).getAllByRole('option');
    expect(options).toHaveLength(3);
    expect(options.map((o) => o.textContent)).toEqual(items);
  });

  it('before any option is focused, the listbox container itself is tabbable and every option is tabindex="-1"', () => {
    // React Aria's composite-widget pattern: the container (`ul[role=listbox]`) carries
    // `tabindex="0"` until an option receives focus, at which point roving tabindex moves onto
    // that option (see the next test) — this is the ARIA Authoring Practices "roving tabindex"
    // pattern's documented bootstrap state, not a bug. Full Arrow-key-driven movement between
    // options is proven in packages/conformance/specs/w5-listbox.spec.ts (jsdom has no real
    // focus/layout to prove that against, per the Honesty Rule).
    render(<BasicListbox />);
    expect(screen.getByRole('listbox')).toHaveAttribute('tabindex', '0');
    const options = screen.getAllByRole('option');
    expect(options.every((o) => o.getAttribute('tabindex') === '-1')).toBe(true);
  });

  it('after clicking an option, that option becomes the sole tabindex="0" (roving tabindex moves onto it)', async () => {
    render(<BasicListbox />);
    const banana = screen.getByRole('option', { name: 'Banana' });
    await userEvent.click(banana);
    const options = screen.getAllByRole('option');
    const tabindexes = options.map((o) => o.getAttribute('tabindex'));
    expect(tabindexes.filter((t) => t === '0')).toHaveLength(1);
    expect(banana).toHaveAttribute('tabindex', '0');
    expect(tabindexes.filter((t) => t !== '0').every((t) => t === '-1')).toBe(true);
  });

  it('works as an uncontrolled listbox via defaultSelectedKeys', () => {
    render(<BasicListbox defaultSelectedKeys={['Banana']} />);
    expect(screen.getByRole('option', { name: 'Apple' })).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByRole('option', { name: 'Banana' })).toHaveAttribute('aria-selected', 'true');
  });

  it('works as a controlled listbox via selectedKeys+onSelectionChange, syncing aria-selected on click', async () => {
    function Controlled() {
      const [selected, setSelected] = useState<Selection>(new Set(['Apple']));
      return (
        <Listbox aria-label="Fruit" selectedKeys={selected} onSelectionChange={setSelected}>
          {items.map((fruit) => (
            <Listbox.Item key={fruit}>{fruit}</Listbox.Item>
          ))}
        </Listbox>
      );
    }
    render(<Controlled />);
    const apple = screen.getByRole('option', { name: 'Apple' });
    const cherry = screen.getByRole('option', { name: 'Cherry' });
    expect(apple).toHaveAttribute('aria-selected', 'true');
    expect(cherry).toHaveAttribute('aria-selected', 'false');
    await userEvent.click(cherry);
    expect(cherry).toHaveAttribute('aria-selected', 'true');
    expect(apple).toHaveAttribute('aria-selected', 'false');
  });

  it('supports selectionMode="multiple" — clicking a second option keeps both selected and sets aria-multiselectable', async () => {
    const onSelectionChange = vi.fn();
    render(
      <Listbox aria-label="Fruit" selectionMode="multiple" onSelectionChange={onSelectionChange}>
        {items.map((fruit) => (
          <Listbox.Item key={fruit}>{fruit}</Listbox.Item>
        ))}
      </Listbox>,
    );
    const listbox = screen.getByRole('listbox');
    expect(listbox).toHaveAttribute('aria-multiselectable', 'true');
    const apple = screen.getByRole('option', { name: 'Apple' });
    const banana = screen.getByRole('option', { name: 'Banana' });
    await userEvent.click(apple);
    await userEvent.click(banana);
    expect(apple).toHaveAttribute('aria-selected', 'true');
    expect(banana).toHaveAttribute('aria-selected', 'true');
  });

  it('disabledKeys marks an option aria-disabled and blocks selection on click', async () => {
    const onSelectionChange = vi.fn();
    render(
      <Listbox aria-label="Fruit" disabledKeys={['Banana']} onSelectionChange={onSelectionChange}>
        {items.map((fruit) => (
          <Listbox.Item key={fruit}>{fruit}</Listbox.Item>
        ))}
      </Listbox>,
    );
    const banana = screen.getByRole('option', { name: 'Banana' });
    expect(banana).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(banana);
    expect(onSelectionChange).not.toHaveBeenCalled();
    expect(banana).toHaveAttribute('aria-selected', 'false');
  });

  it('forwards ref to the underlying ul element', () => {
    const ref = createRef<HTMLUListElement>();
    render(<Listbox aria-label="Fruit" ref={ref}>{[<Listbox.Item key="only">Only</Listbox.Item>]}</Listbox>);
    expect(ref.current).toBeInstanceOf(HTMLUListElement);
  });

  it('has no axe violations', async () => {
    const { container } = render(<BasicListbox />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no axe violations in multiple-selection mode with a selection present', async () => {
    const { container } = render(<BasicListbox selectionMode="multiple" defaultSelectedKeys={['Apple', 'Cherry']} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
