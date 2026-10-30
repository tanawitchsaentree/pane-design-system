// @example Two at a time on a wide pane
import { Card, Carousel, Text } from 'pane-react';

export default function CarouselTwo() {
  return <Card as="div" className="demo-card demo-wide"><Carousel label="New this week" perView={2}><Card as="div" className="demo-card"><Text weight="semibold">Lofoten, March</Text><Text size="label" tone="secondary">Added Monday</Text></Card><Card as="div" className="demo-card"><Text weight="semibold">Senja at night</Text><Text size="label" tone="secondary">Added Tuesday</Text></Card><Card as="div" className="demo-card"><Text weight="semibold">Höfn harbour</Text><Text size="label" tone="secondary">Added Wednesday</Text></Card><Card as="div" className="demo-card"><Text weight="semibold">Reine bridge</Text><Text size="label" tone="secondary">Added Friday</Text></Card></Carousel></Card>;
}
