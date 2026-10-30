// @example A tour of three marks
import { useState } from 'react';
import { Button, Card, CoachMark, Flex } from 'pane-react';

export default function CoachTour() {
  const [step, setStep] = useState(0);
  const marks = [['Places', 'Filter by place'], ['Sort', 'Sort by date or price'], ['Share', 'Share an album']];
  return (
    <Card as="div" className="demo-card">
      <Flex gap="md" wrap>
        {marks.map(([b, t], i) => <CoachMark key={b} open={step === i + 1} title={t} step={i + 1} total={3} onNext={() => setStep(step === 3 ? 0 : step + 1)} onSkip={() => setStep(0)}><Button variant="glass">{b}</Button></CoachMark>)}
      </Flex>
      <Button onClick={() => setStep(1)}>Start the tour</Button>
    </Card>
  );
}
