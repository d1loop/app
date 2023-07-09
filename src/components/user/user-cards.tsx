/* eslint-disable linebreak-style */
import cn from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { StatsEmpty } from '@components/post/stats-empty';
import { Loading } from '@components/ui/loading';
import { variants } from '@components/user/user-header';
import { UserCard } from './user-card';
import type { User } from '@lib/types/user';
import type { StatsType } from '@components/view/view-tweet-stats';
import type { StatsEmptyProps } from '@components/post/stats-empty';

type FollowType = 'following' | 'followers';

type CombinedTypes = StatsType | FollowType;

type UserCardsProps = {
  data: User[] | null;
  type: CombinedTypes;
  follow?: boolean;
  loading: boolean;
};

type NoStatsData = Record<CombinedTypes, StatsEmptyProps>;

const allNoStatsData: Readonly<NoStatsData> = {
  loops: {
    title: 'Make a loop',
    description:
      'Share someone else’s post on your account by Looping it. When you do, it’ll show up here.'
  },
  likes: {
    title: 'No post likes yet',
    description: 'When you like a post, it’ll show up here.'
  },
  following: {
    title: 'Be in the know',
    description:
      'Following accounts is an easy way to support and know what’s happening with the topics and people you’re interested in.'
  },
  followers: {
    title: 'Looking for followers?',
    description:
      'When someone follows this account, they’ll show up in this list.'
  }
};

export function UserCards({
  data,
  type,
  follow,
  loading
}: UserCardsProps): JSX.Element {
  const noStatsData = allNoStatsData[type];
  const modal = ['loops', 'likes'].includes(type);

  return (
    <section
      className={cn(
        modal && 'h-full overflow-y-auto [&>div:first-child>a]:mt-[52px]',
        loading && 'flex items-center justify-center'
      )}
    >
      {loading ? (
        <Loading className={modal ? 'mt-[52px]' : 'mt-5'} />
      ) : (
        <AnimatePresence mode='popLayout'>
          {data?.length ? (
            data.map((userData) => (
              <motion.div layout='position' key={userData.id} {...variants}>
                <UserCard {...userData} follow={follow} modal={modal} />
              </motion.div>
            ))
          ) : (
            <StatsEmpty {...noStatsData} modal={modal} />
          )}
        </AnimatePresence>
      )}
    </section>
  );
}
