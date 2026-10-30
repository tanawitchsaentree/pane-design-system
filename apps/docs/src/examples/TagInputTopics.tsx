// @example Tags for a photo
import { Card, TagInput } from 'pane-react';

export default function TagInputTopics() {
  return <Card as="div" className="demo-card"><TagInput label="Tags" placeholder="Add a tag" hint="Press Enter or a comma after each tag." defaultValue={['fjords', 'dawn']} /></Card>;
}
