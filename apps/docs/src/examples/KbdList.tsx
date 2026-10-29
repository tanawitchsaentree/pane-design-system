// @example A list of shortcuts
import { Card, Flex, Kbd, Stack, Text } from 'pane-react';

export default function KbdList() {
  return (
    <Card as="div" className="demo-card">
      <Stack gap="sm">
        <Flex justify="between"><Text>New post</Text><Flex gap="xs"><Kbd>⌘</Kbd><Kbd>N</Kbd></Flex></Flex>
        <Flex justify="between"><Text>Next photo</Text><Kbd>→</Kbd></Flex>
        <Flex justify="between"><Text>Close</Text><Kbd>Esc</Kbd></Flex>
      </Stack>
    </Card>
  );
}
