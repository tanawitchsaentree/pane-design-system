// @example A parent with mixed children
import { useState } from 'react';
import { Card, Checkbox, Stack } from 'pane-react';

export default function CheckboxMixed() {
  const [items, setItems] = useState({ photos: true, prints: false });
  const all = items.photos && items.prints;
  const some = items.photos || items.prints;
  return (
    <Card as="div" className="demo-card">
      <Checkbox label="Download everything" checked={all ? true : some ? 'indeterminate' : false} onCheckedChange={(c) => setItems({ photos: c === true, prints: c === true })} />
      <Stack gap="xs" className="indent">
        <Checkbox label="Photos" checked={items.photos} onCheckedChange={(c) => setItems({ ...items, photos: c === true })} />
        <Checkbox label="Prints" checked={items.prints} onCheckedChange={(c) => setItems({ ...items, prints: c === true })} />
      </Stack>
    </Card>
  );
}
