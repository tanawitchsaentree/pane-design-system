// @example A toast with an action
import { Toast } from 'pane-react';

export default function ToastAction() {
  return <Toast preview open onOpenChange={() => {}} title="Trip archived" action={{ label: 'Undo', altText: 'Undo from Archive in the menu', onClick: () => {} }} />;
}
