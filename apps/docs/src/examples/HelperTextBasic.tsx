// @example Help and an error
import { Card, HelperText } from 'pane-react';

export default function HelperTextBasic() {
  return (
    <Card as="div" className="demo-card">
      <HelperText>Shown on your profile and posts.</HelperText>
      <HelperText tone="error">Keep it under 40 characters.</HelperText>
    </Card>
  );
}
