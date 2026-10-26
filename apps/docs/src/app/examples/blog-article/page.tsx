import { BlogArticleExample } from './BlogArticleExample';
import { TemplatePage } from '@/components/TemplatePage';

export const metadata = { title: 'Blog article — Examples — Dial' };

export default function Page() {
  return (
    <TemplatePage sourceRelativePath="examples/blog-article/BlogArticleExample.tsx" filename="BlogArticleExample.tsx">
      <BlogArticleExample />
    </TemplatePage>
  );
}
