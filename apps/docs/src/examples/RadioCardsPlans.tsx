// @example Three plans in a row
import { Card, RadioCards } from 'pane-react';

export default function RadioCardsPlans() {
  return <Card as="div" className="demo-card"><RadioCards label="Plan" columns={3} defaultValue="plus" options={[{ value: 'free', title: 'Free', description: '3 albums' }, { value: 'plus', title: 'Plus', description: 'Unlimited' }, { value: 'pro', title: 'Pro', description: 'Prints at cost' }]} /></Card>;
}
