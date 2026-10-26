'use client';

import { Drawer, Button } from 'dial-react';

export function BasicDrawer() {
  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        <Button variant="outline">Open filters</Button>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Title>Filters</Drawer.Title>
        <Drawer.Description>Narrow down results by category and price.</Drawer.Description>
      </Drawer.Content>
    </Drawer.Root>
  );
}

export function BottomDrawer() {
  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        <Button variant="outline">Open bottom sheet</Button>
      </Drawer.Trigger>
      <Drawer.Content placement="bottom">
        <Drawer.Title>Share</Drawer.Title>
        <Drawer.Description>The `placement=&quot;bottom&quot;` case covers the former Sheet/BottomSheet role.</Drawer.Description>
      </Drawer.Content>
    </Drawer.Root>
  );
}

export function LeftDrawer() {
  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        <Button variant="outline">Open left drawer</Button>
      </Drawer.Trigger>
      <Drawer.Content placement="left" hideCloseButton>
        <Drawer.Title>Navigation</Drawer.Title>
        <Drawer.Description>Slides in from the left edge instead of the right.</Drawer.Description>
      </Drawer.Content>
    </Drawer.Root>
  );
}
