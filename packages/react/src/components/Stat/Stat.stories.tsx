import type { Meta, StoryObj } from '@storybook/react';
import { Stat } from './Stat';
import type { StatTrendDirection } from './Stat';

const DIRECTIONS: StatTrendDirection[] = ['up', 'down', 'neutral'];

const meta: Meta<typeof Stat> = {
  title: 'Data Display/Stat',
  component: Stat,
  argTypes: {
    label: { control: 'text' },
    description: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Stat>;

export const Default: Story = {
  parameters: { docs: { description: { story: 'Label + value only, no trend or description.' } } },
  args: { label: 'Total revenue', value: '$12,450' },
};

export const WithTrend: Story = {
  parameters: { docs: { description: { story: 'Adds an upward trend indicator — icon + colored text, never color alone.' } } },
  args: {
    label: 'Total revenue',
    value: '$12,450',
    trend: { direction: 'up', value: '+12% this month' },
  },
};

export const WithDescription: Story = {
  parameters: { docs: { description: { story: 'Adds supporting copy under the trend row.' } } },
  args: {
    label: 'Active users',
    value: '8,204',
    trend: { direction: 'down', value: '-3% this week' },
    description: 'Compared to the previous 7 days',
  },
};

export const AllTrendDirections: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'All three trend directions side by side — each renders a genuinely different icon glyph (ascending arrow / descending arrow / flat line), not just a recolored arrow, so the distinction survives forced-colors and grayscale rendering.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: 32 }}>
      {DIRECTIONS.map((direction) => (
        <Stat
          key={direction}
          label="Conversion rate"
          value="4.8%"
          trend={{ direction, value: direction === 'neutral' ? '0% change' : direction === 'up' ? '+1.2pp' : '-0.6pp' }}
        />
      ))}
    </div>
  ),
};

export const RichValue: Story = {
  parameters: { docs: { description: { story: '`value` accepts ReactNode — here a caller mixes a smaller-weight unit suffix inline with the number.' } } },
  args: {
    label: 'Average session',
    value: (
      <>
        4m <span style={{ fontSize: '0.6em', fontWeight: 500 }}>32s</span>
      </>
    ),
  },
};

export const Grid: Story = {
  parameters: { docs: { description: { story: 'Common composition: several Stat tiles laid out in a row, as in a dashboard KPI strip.' } } },
  render: () => (
    <div style={{ display: 'flex', gap: 48 }}>
      <Stat label="Total revenue" value="$12,450" trend={{ direction: 'up', value: '+12% this month' }} />
      <Stat label="Active users" value="8,204" trend={{ direction: 'down', value: '-3% this week' }} />
      <Stat label="Support tickets" value="42" trend={{ direction: 'neutral', value: 'No change' }} />
      <Stat label="Signups" value="1,092" />
    </div>
  ),
};

export const Playground: Story = {
  parameters: { docs: { description: { story: 'Interactive playground — adjust props via the Controls panel below.' } } },
  args: {
    label: 'Total revenue',
    value: '$12,450',
    trend: { direction: 'up', value: '+12% this month' },
    description: 'Compared to last month',
  },
};
