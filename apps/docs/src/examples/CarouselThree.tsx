// @example Three small cards
import { Card, Carousel, Text } from 'pane-react';

export default function CarouselThree() {
  return <Card as="div" className="demo-card demo-wide"><Carousel label="Collections" perView={3}><Card as="div" className="demo-card"><Text weight="semibold">Winter</Text><Text size="label" tone="secondary">12 prints</Text></Card><Card as="div" className="demo-card"><Text weight="semibold">Harbours</Text><Text size="label" tone="secondary">8 prints</Text></Card><Card as="div" className="demo-card"><Text weight="semibold">Night</Text><Text size="label" tone="secondary">6 prints</Text></Card><Card as="div" className="demo-card"><Text weight="semibold">Bridges</Text><Text size="label" tone="secondary">5 prints</Text></Card><Card as="div" className="demo-card"><Text weight="semibold">Birch</Text><Text size="label" tone="secondary">9 prints</Text></Card></Carousel></Card>;
}
