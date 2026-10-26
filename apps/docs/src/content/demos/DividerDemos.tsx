'use client';

import { Divider, Stack, Flex, Text, IconButton } from 'dial-react';

function PlusSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function TrashSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    </svg>
  );
}

export function BasicDivider() {
  return (
    <Stack gap="300">
      <div>Section one</div>
      <Divider />
      <div>Section two</div>
    </Stack>
  );
}

export function VerticalDivider() {
  return (
    <Flex align="center" gap="300" style={{ height: 40 }}>
      <span>Item A</span>
      <Divider orientation="vertical" />
      <span>Item B</span>
    </Flex>
  );
}

export function StrongDivider() {
  return (
    <Stack gap="300">
      <div>Section one</div>
      <Divider variant="hairline-strong" />
      <div>Section two</div>
    </Stack>
  );
}

export function DividerInList() {
  return (
    <Stack gap="0" style={{ maxWidth: 360 }}>
      <Flex justify="between" align="center" style={{ padding: 'var(--ds-space-inset-sm) 0' }}>
        <Text>Invoice #1042</Text>
        <Text color="subtle">$240.00</Text>
      </Flex>
      <Divider />
      <Flex justify="between" align="center" style={{ padding: 'var(--ds-space-inset-sm) 0' }}>
        <Text>Invoice #1041</Text>
        <Text color="subtle">$180.00</Text>
      </Flex>
      <Divider />
      <Flex justify="between" align="center" style={{ padding: 'var(--ds-space-inset-sm) 0' }}>
        <Text>Invoice #1040</Text>
        <Text color="subtle">$95.00</Text>
      </Flex>
    </Stack>
  );
}

export function DividerInToolbar() {
  return (
    <Flex align="center" gap="200" style={{ height: 40, padding: 'var(--ds-space-inset-sm)' }}>
      <IconButton aria-label="Add item">
        <PlusSvg />
      </IconButton>
      <Divider orientation="vertical" />
      <IconButton aria-label="Delete item">
        <TrashSvg />
      </IconButton>
    </Flex>
  );
}
