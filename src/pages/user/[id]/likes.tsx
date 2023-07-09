import { AnimatePresence } from 'framer-motion';
import { query, where, orderBy } from 'firebase/firestore';
import { useCollection } from '@lib/hooks/useCollection';
import { tweetsCollection } from '@lib/firebase/collections';
import { useUser } from '@lib/context/user-context';
import { UserLayout, ProtectedLayout } from '@components/layout/common-layout';
import { MainLayout } from '@components/layout/main-layout';
import { SEO } from '@components/common/seo';
import { UserDataLayout } from '@components/layout/user-data-layout';
import { UserHomeLayout } from '@components/layout/user-home-layout';
import { Tweet } from '@components/post/post';
import { Loading } from '@components/ui/loading';
import { StatsEmpty } from '@components/post/stats-empty';
import type { ReactElement, ReactNode } from 'react';

export default function UserLikes(): JSX.Element {
  const { user } = useUser();

  const { id, name, username } = user ?? {};

  const { data, loading } = useCollection(
    query(
      tweetsCollection,
      where('userLikes', 'array-contains', id),
      orderBy('createdAt', 'desc')
    ),
    { includeUser: true, allowNull: true }
  );

  return (
    <section>
      <SEO
        title={`Posts liked by ${name as string} (@${
          username as string
        }) / d1loop`}
      />
      {loading ? (
        <Loading className='mt-5' />
      ) : !data ? (
        <StatsEmpty
          title={`@${username as string} hasn't liked any posts`}
          description='When they do, those posts will show up here.'
        />
      ) : (
        <AnimatePresence mode='popLayout'>
          {data.map((tweet) => (
            <Tweet {...tweet} key={tweet.id} />
          ))}
        </AnimatePresence>
      )}
    </section>
  );
}

UserLikes.getLayout = (page: ReactElement): ReactNode => (
  <ProtectedLayout>
    <MainLayout>
      <UserLayout>
        <UserDataLayout>
          <UserHomeLayout>{page}</UserHomeLayout>
        </UserDataLayout>
      </UserLayout>
    </MainLayout>
  </ProtectedLayout>
);
