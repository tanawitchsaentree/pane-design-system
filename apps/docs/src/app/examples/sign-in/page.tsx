import { SignInExample } from './SignInExample';
import { TemplatePage } from '@/components/TemplatePage';

export const metadata = { title: 'Sign in — Examples — Dial' };

export default function Page() {
  return (
    <TemplatePage sourceRelativePath="examples/sign-in/SignInExample.tsx" filename="SignInExample.tsx">
      <SignInExample />
    </TemplatePage>
  );
}
