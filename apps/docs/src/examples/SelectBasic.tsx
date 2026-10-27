// @example A select on a settings pane
import { useState } from 'react';
import { Card, Select } from 'pane-react';

export default function SelectBasic() {
  const [who, setWho] = useState('following');
  return (
    <Card as="section" aria-labelledby="sel-h" className="demo-card">
      <h3 id="sel-h" className="flush">Messages</h3>
      <Select label="Who can message you" value={who} onValueChange={setWho} options={[
        { value: 'everyone', label: 'Everyone' },
        { value: 'following', label: 'People you follow' },
        { value: 'nobody', label: 'No one' },
      ]} />
    </Card>
  );
}
