// @example Two selects in one settings pane
import { Card, Select, Stack } from 'pane-react';

export default function SelectInForm() {
  return (
    <Card as="section" aria-label="Privacy" className="demo-card">
      <Stack gap="md">
        <Select label="Who can see your posts" defaultValue="everyone" options={[{ value: 'everyone', label: 'Everyone' }, { value: 'followers', label: 'Followers' }]} />
        <Select label="Who can tag you" defaultValue="following" options={[{ value: 'everyone', label: 'Everyone' }, { value: 'following', label: 'People you follow' }, { value: 'nobody', label: 'No one' }]} />
      </Stack>
    </Card>
  );
}
