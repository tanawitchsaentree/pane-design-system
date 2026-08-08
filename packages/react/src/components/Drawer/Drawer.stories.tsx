import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../Button/Button';
import { Drawer } from './Drawer';
import type { DrawerPlacement } from './Drawer';

const PLACEMENTS: DrawerPlacement[] = ['left', 'right', 'bottom'];

const meta: Meta = {
  title: 'Overlays/Drawer',
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        <Button>Open drawer</Button>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Title>Drawer title</Drawer.Title>
        <Drawer.Description>Slides in from the right by default.</Drawer.Description>
      </Drawer.Content>
    </Drawer.Root>
  ),
};

export const Placements: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12 }}>
      {PLACEMENTS.map((placement) => (
        <Drawer.Root key={placement}>
          <Drawer.Trigger asChild>
            <Button variant="outline">{placement}</Button>
          </Drawer.Trigger>
          <Drawer.Content placement={placement}>
            <Drawer.Title>{placement} drawer</Drawer.Title>
            <Drawer.Description>Slides in from the {placement}.</Drawer.Description>
          </Drawer.Content>
        </Drawer.Root>
      ))}
    </div>
  ),
};

export const BottomSheetRole: Story = {
  name: 'placement=bottom (D-017: former Sheet/BottomSheet role)',
  render: () => (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        <Button>Open bottom sheet</Button>
      </Drawer.Trigger>
      <Drawer.Content placement="bottom">
        <Drawer.Title>Bottom sheet</Drawer.Title>
        <Drawer.Description>Full-width panel anchored to the bottom edge.</Drawer.Description>
      </Drawer.Content>
    </Drawer.Root>
  ),
};

export const ControlledOpenClose: Story = {
  render: () => (
    <Drawer.Root defaultOpen>
      <Drawer.Trigger asChild>
        <Button>Trigger (starts open)</Button>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Title>Starts open</Drawer.Title>
      </Drawer.Content>
    </Drawer.Root>
  ),
};

export const Playground: Story = {
  render: () => (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        <Button intent="primary">Playground trigger</Button>
      </Drawer.Trigger>
      <Drawer.Content placement="right">
        <Drawer.Title>Playground drawer</Drawer.Title>
        <Drawer.Description>Adjust placement prop on Drawer.Content via source code.</Drawer.Description>
      </Drawer.Content>
    </Drawer.Root>
  ),
};
