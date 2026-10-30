// @example A group of settings
import { List, ListItem, Switch, VisuallyHidden } from 'pane-react';

export default function ListSettings() {
  return <List label="Shop settings"><ListItem title="Shop name" trailing="North Light" href="#name" chevron /><ListItem title="Payments" description="Card and bank transfer" href="#payments" chevron /><ListItem title="Holiday mode" description="Hides the shop for a while" trailing={<Switch label={<VisuallyHidden>Holiday mode</VisuallyHidden>} />} /></List>;
}
