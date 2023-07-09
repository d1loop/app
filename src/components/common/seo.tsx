/* eslint-disable linebreak-style */
import { useRouter } from 'next/router';
import Head from 'next/head';
import { siteURL } from '@lib/env';

type MainLayoutProps = {
  title: string;
  image?: string;
  description?: string;
};

export function SEO({
  title,
  image,
  description
}: MainLayoutProps): JSX.Element {
  const { asPath } = useRouter();

  return (
    <Head>
      <title>{title}</title>
      <meta name='og:title' content={title} />
      <meta
        name='og:url'
        content={`${siteURL}${asPath === '/' ? '' : asPath}`}
      />
      <link rel='icon' href='https://avatars.githubusercontent.com/u/135523178?s=48&v=4' />
    </Head>
  );
}
