// @example Busy while a refresh runs
import { Card, IconButton } from 'pane-react';

export default function IconButtonLoading() {
  return <Card as="div" className="demo-card"><IconButton aria-label="Refresh prints" loading><svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18"><path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></IconButton></Card>;
}
