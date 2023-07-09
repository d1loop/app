import { CustomIcon } from '@components/ui/custom-icon';
import { SEO } from './seo';

export function Placeholder(): JSX.Element {
  return (
    <main className='flex min-h-screen items-center justify-center'>
      <SEO
        title='d1loop'
        description='The new social platform.'
      />
    </main>
  );
}
