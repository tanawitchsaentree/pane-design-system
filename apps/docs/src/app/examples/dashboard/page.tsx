import { DashboardExample } from './DashboardExample';
import { TemplatePage } from '@/components/TemplatePage';

export const metadata = { title: 'Dashboard — Examples — Dial' };

export default function Page() {
  return (
    <TemplatePage sourceRelativePath="examples/dashboard/DashboardExample.tsx" filename="DashboardExample.tsx">
      <DashboardExample />
    </TemplatePage>
  );
}
