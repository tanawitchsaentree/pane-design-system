// @example An assistant that signs its turn with an avatar
import { Avatar, Card, ChatMessage } from 'pane-react';

export default function ChatAvatar() {
  return <Card as="div" className="demo-card demo-wide"><ChatMessage sender="assistant" author="Lumen" avatar={<Avatar name="Lumen" size="sm" decorative />}>Yes. 14:10 and 15:30 are free on Thursday.</ChatMessage></Card>;
}
