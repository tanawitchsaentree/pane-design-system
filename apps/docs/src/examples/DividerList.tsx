// @example A list of places with dividers between groups
import { Card, Divider, Stack, Text } from 'pane-react';

export default function DividerList() {
  return (
    <Card as="div" className="demo-card">
      <Stack gap="sm"><Text weight="semibold">Norway</Text><Text>Lofoten · Senja</Text></Stack>
      <Divider />
      <Stack gap="sm"><Text weight="semibold">Iceland</Text><Text>Vík · Höfn</Text></Stack>
    </Card>
  );
}
