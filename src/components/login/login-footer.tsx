const footerLinks = [
  ['Wiki', 'https://d1loop-wiki.vercel.app'],
  ['Privacy policy', 'https://d1loop-wiki.vercel.app/privacy-policy'],
  ['Terms of Service', 'https://d1loop-wiki.vercel.app/terms-of-service'],
  ['Github', 'https://github.com/d1loop'],
] as const;

export function LoginFooter(): JSX.Element {
  return (
    <footer className='hidden justify-center p-4 text-sm text-light-secondary dark:text-dark-secondary lg:flex'>
      <nav className='flex flex-wrap justify-center gap-4 gap-y-2'>
        {footerLinks.map(([linkName, href]) => (
          <a
            className='custom-underline'
            target='_blank'
            rel='noreferrer'
            href={href}
            key={linkName}
          >
            {linkName}
          </a>
        ))}
        <p>© {new Date().getFullYear()} d1loop.</p>
      </nav>
    </footer>
  );
}
