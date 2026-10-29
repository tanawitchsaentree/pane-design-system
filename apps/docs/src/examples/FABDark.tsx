// @example On a dark scene, glowing
import { Card, FAB } from 'pane-react';
import { IconPencil } from '../icons';

export default function FABDark() {
  return <Card as="div" className="demo-card demo-phone"><FAB position="contained" icon={<IconPencil />} label="New post" /></Card>;
}
