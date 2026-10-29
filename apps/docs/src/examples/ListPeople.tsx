// @example People, inside a card
import { Avatar, Card, List, ListItem } from 'pane-react';

export default function ListPeople() {
  return <Card as="div" className="demo-card"><List variant="plain" label="Buyers"><ListItem leading={<Avatar name="Mara Lind" size="sm" />} title="Mara Lind" description="Bought 3 prints" /><ListItem leading={<Avatar name="Jon Berg" size="sm" />} title="Jon Berg" description="Bought 1 print" /><ListItem leading={<Avatar name="Ida Sand" size="sm" />} title="Ida Sand" description="Bought 2 prints" /></List></Card>;
}
