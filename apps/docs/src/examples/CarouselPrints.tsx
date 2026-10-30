// @example Featured prints
import { Card, Carousel, Text } from 'pane-react';

export default function CarouselPrints() {
  return <Card as="div" className="demo-card demo-wide"><Carousel label="Featured prints"><Card as="div" className="demo-card"><Text weight="semibold">Lofoten, March</Text><Text size="label" tone="secondary">€120 · 40 × 50 cm</Text></Card><Card as="div" className="demo-card"><Text weight="semibold">Senja at night</Text><Text size="label" tone="secondary">€95 · 30 × 40 cm</Text></Card><Card as="div" className="demo-card"><Text weight="semibold">Höfn harbour</Text><Text size="label" tone="secondary">€180 · 50 × 70 cm</Text></Card><Card as="div" className="demo-card"><Text weight="semibold">Reine bridge</Text><Text size="label" tone="secondary">€120 · 40 × 50 cm</Text></Card></Carousel></Card>;
}
