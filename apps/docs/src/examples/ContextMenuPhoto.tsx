// @example Right click or long press a photo
import { AspectRatio, Card, ContextMenu, Mesh, Text } from 'pane-react';

export default function ContextMenuPhoto() {
  return (
    <Card as="div" className="demo-card">
      <ContextMenu label="Photo actions" items={[{ label: 'Copy', onSelect: () => {} }, { label: 'Save image', onSelect: () => {} }, 'separator', { label: 'Delete', tone: 'critical', onSelect: () => {} }]}>
        <div role="group" tabIndex={0} aria-label="Photo, press the menu key for actions"><AspectRatio ratio="video" className="demo-media"><Mesh preset="dusk" /></AspectRatio></div>
      </ContextMenu>
      <Text size="label" tone="secondary">Right click, long press or press the menu key.</Text>
    </Card>
  );
}
