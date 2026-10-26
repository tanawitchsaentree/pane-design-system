import { Error404Example } from './Error404Example';
import { TemplatePage } from '@/components/TemplatePage';

export const metadata = { title: '404 — Examples — Dial' };

export default function Page() {
  return (
    <TemplatePage sourceRelativePath="examples/error-404/Error404Example.tsx" filename="Error404Example.tsx">
      <Error404Example />
    </TemplatePage>
  );
}
