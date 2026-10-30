// @example A glyph before or after the label
import { Button, Card, Flex } from 'pane-react';

const Plus = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>;
const Arrow = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;

export default function ButtonIcons() {
  return <Card as="div" className="demo-card"><Flex gap="md" wrap><Button variant="glass" icon={<Plus />}>New album</Button><Button iconEnd={<Arrow />}>Continue</Button></Flex></Card>;
}
