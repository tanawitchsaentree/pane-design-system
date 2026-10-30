// @example Several readings in a settings card
import { Card, Flex, Meter } from 'pane-react';

export default function MeterQuota() {
  return <Card as="div" className="demo-card"><Flex direction="column" gap="lg"><Meter label="Photos" value={31} max={50} high={40} valueText="31 of 50 GB" /><Meter label="Video" value={9} max={20} high={16} valueText="9 of 20 GB" /><Meter label="Backups" value={4} max={10} high={8} valueText="4 of 10 GB" /></Flex></Card>;
}
