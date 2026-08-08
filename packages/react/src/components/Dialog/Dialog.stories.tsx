import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../Button/Button';
import { Dialog } from './Dialog';
import type { DialogSize } from './Dialog';

const SIZES: DialogSize[] = ['sm', 'md', 'lg', 'full'];

const meta: Meta = {
  title: 'Overlays/Dialog',
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button>Open dialog</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Dialog title</Dialog.Title>
        <Dialog.Description>A short description of what this dialog is for.</Dialog.Description>
        <p>Body content goes here.</p>
      </Dialog.Content>
    </Dialog.Root>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12 }}>
      {SIZES.map((size) => (
        <Dialog.Root key={size}>
          <Dialog.Trigger asChild>
            <Button variant="outline">{size}</Button>
          </Dialog.Trigger>
          <Dialog.Content size={size}>
            <Dialog.Title>{size} dialog</Dialog.Title>
            <Dialog.Description>Width preset: {size}.</Dialog.Description>
          </Dialog.Content>
        </Dialog.Root>
      ))}
    </div>
  ),
};

export const WithoutCloseButton: Story = {
  name: 'Without close button (explicit action buttons instead)',
  render: () => (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button intent="danger">Delete item</Button>
      </Dialog.Trigger>
      <Dialog.Content hideCloseButton>
        <Dialog.Title>Delete this item?</Dialog.Title>
        <Dialog.Description>This action cannot be undone.</Dialog.Description>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Dialog.Close asChild>
            <Button variant="ghost">Cancel</Button>
          </Dialog.Close>
          <Dialog.Close asChild>
            <Button intent="danger">Delete</Button>
          </Dialog.Close>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  ),
};

export const ControlledOpenClose: Story = {
  render: () => (
    <Dialog.Root defaultOpen>
      <Dialog.Trigger asChild>
        <Button>Trigger (starts open)</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Starts open</Dialog.Title>
        <Dialog.Description>Opened via defaultOpen — Escape or backdrop click to close.</Dialog.Description>
      </Dialog.Content>
    </Dialog.Root>
  ),
};

export const Playground: Story = {
  render: () => (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button intent="primary">Playground trigger</Button>
      </Dialog.Trigger>
      <Dialog.Content size="md">
        <Dialog.Title>Playground dialog</Dialog.Title>
        <Dialog.Description>Adjust size prop on Dialog.Content via source code.</Dialog.Description>
      </Dialog.Content>
    </Dialog.Root>
  ),
};
