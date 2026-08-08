import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Tooltip } from './Tooltip';

function BasicTooltip() {
  return (
    <Tooltip.Provider delayDuration={0}>
      <Tooltip.Root>
        <Tooltip.Trigger>Hover target</Tooltip.Trigger>
        <Tooltip.Content>Hint text</Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

describe('Tooltip', () => {
  it('is closed by default and opens on hover', async () => {
    render(<BasicTooltip />);
    expect(screen.queryByText('Hint text')).not.toBeInTheDocument();
    await userEvent.hover(screen.getByText('Hover target'));
    expect(await screen.findByText('Hint text')).toBeInTheDocument();
  });

  it('opens on keyboard focus (D-002: hover is not the only trigger)', async () => {
    render(<BasicTooltip />);
    await userEvent.tab();
    expect(await screen.findByText('Hint text')).toBeInTheDocument();
  });

  it('closes when the trigger loses focus (blur)', async () => {
    render(
      <div>
        <BasicTooltip />
        <button type="button">elsewhere</button>
      </div>,
    );
    screen.getByText('Hover target').focus();
    expect(await screen.findByText('Hint text')).toBeInTheDocument();
    await userEvent.click(screen.getByText('elsewhere'));
    await waitFor(() => expect(screen.queryByText('Hint text')).not.toBeInTheDocument());
  });

  it('closes on Escape', async () => {
    render(<BasicTooltip />);
    await userEvent.hover(screen.getByText('Hover target'));
    expect(await screen.findByText('Hint text')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByText('Hint text')).not.toBeInTheDocument());
  });

  it('has no axe violations when open', async () => {
    const { container } = render(<BasicTooltip />);
    await userEvent.hover(screen.getByText('Hover target'));
    await screen.findByText('Hint text');
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
