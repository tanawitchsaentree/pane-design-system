// @example Opened from a button or ⌘K
import { useState } from 'react';
import { Button, Card, CommandPalette, Flex, Kbd, Text } from 'pane-react';

export default function PaletteOpen() {
  const [open, setOpen] = useState(false);
  return (
    <Card as="div" className="demo-card">
      <Flex gap="md" align="center">
        <Button variant="glass" onClick={() => setOpen(true)}>Search commands</Button>
        <Text size="label" tone="secondary">or press <Kbd>⌘</Kbd><Kbd>K</Kbd></Text>
      </Flex>
      <CommandPalette open={open} onOpenChange={setOpen} commands={[{ id: 'new', label: 'New print', group: 'Prints', shortcut: ['⌘', 'N'], onSelect: () => {} }, { id: 'find', label: 'Find an order', group: 'Orders', keywords: ['search'], onSelect: () => {} }, { id: 'ship', label: 'Mark as shipped', group: 'Orders', onSelect: () => {} }, { id: 'settings', label: 'Open settings', group: 'Shop', keywords: ['preferences'], shortcut: ['⌘', ','], onSelect: () => {} }]} />
    </Card>
  );
}
