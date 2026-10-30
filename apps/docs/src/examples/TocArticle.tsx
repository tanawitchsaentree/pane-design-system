// @example The sections of an article
import { Card, TableOfContents } from 'pane-react';

export default function TocArticle() {
  return <Card as="div" className="demo-card"><TableOfContents track={false} items={[{ id: 'toc-light', label: 'Winter light' }, { id: 'toc-kit', label: 'What to pack' }, { id: 'toc-gloves', label: 'Gloves', level: 3 }, { id: 'toc-route', label: 'The route' }]} /></Card>;
}
