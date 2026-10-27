// @example One answer from a short list
import { Card, Radio, RadioGroup } from 'pane-react';

export default function RadioBasic() {
  return (
    <Card as="section" aria-label="Messages" className="demo-card">
      <RadioGroup label="Who can message you" defaultValue="following">
        <Radio value="everyone" label="Everyone" />
        <Radio value="following" label="People you follow" />
        <Radio value="nobody" label="No one" />
      </RadioGroup>
    </Card>
  );
}
