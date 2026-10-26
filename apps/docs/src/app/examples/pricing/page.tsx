import { PricingExample } from './PricingExample';
import { TemplatePage } from '@/components/TemplatePage';

export const metadata = { title: 'Pricing — Examples — Dial' };

export default function Page() {
  return (
    <TemplatePage sourceRelativePath="examples/pricing/PricingExample.tsx" filename="PricingExample.tsx">
      <PricingExample />
    </TemplatePage>
  );
}
