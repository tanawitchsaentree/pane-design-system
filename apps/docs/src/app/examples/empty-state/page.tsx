import { EmptyStateExample } from './EmptyStateExample';
import { TemplatePage } from '@/components/TemplatePage';

export const metadata = { title: 'Empty state — Examples — Dial' };

export default function Page() {
  return (
    <TemplatePage sourceRelativePath="examples/empty-state/EmptyStateExample.tsx" filename="EmptyStateExample.tsx">
      <EmptyStateExample />
    </TemplatePage>
  );
}
