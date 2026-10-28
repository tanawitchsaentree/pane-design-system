// @example Tags categorising a post
import { Card, Tag } from 'pane-react';

export default function TagBasic() {
  return (
    <Card as="div" className="demo-card">
      <p className="flush">Visual Flow · Asset 05</p>
      <div className="demo-row">
        <Tag>Visual asset 05</Tag>
        <Tag>Trending</Tag>
        <Tag>Tech</Tag>
      </div>
    </Card>
  );
}
