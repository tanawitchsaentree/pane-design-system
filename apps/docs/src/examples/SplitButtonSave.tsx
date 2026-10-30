// @example Save, with the rarer ways to save a press away
import { SplitButton } from 'pane-react';

export default function SplitButtonSave() {
  return <SplitButton onClick={() => {}} menuLabel="More ways to save" items={[{ label: 'Save as…', onSelect: () => {} }, { label: 'Save a copy', onSelect: () => {} }]}>Save</SplitButton>;
}
