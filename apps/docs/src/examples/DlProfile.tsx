// @example A short profile
import { Card, DescriptionList } from 'pane-react';

export default function DlProfile() {
  return <Card as="div" className="demo-card"><DescriptionList layout="inline" items={[{ term: 'Name', detail: 'Mara Lind' }, { term: 'Email', detail: 'mara.lind@example.com' }, { term: 'Member since', detail: 'March 2024' }]} /></Card>;
}
