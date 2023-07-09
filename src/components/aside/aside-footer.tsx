const footerLinks = [
  ['Wiki', 'https://d1loop-wiki.vercel.app'],
  ['Privacy policy', 'https://d1loop-wiki.vercel.app/privacy-policy'],
  ['Terms of Service', 'https://d1loop-wiki.vercel.app/terms-of-service'],
  ['Github', 'https://github.com/d1loop'],
] as const;

export function AsideFooter(): JSX.Element {
  return (
    <footer
      className='sticky top-16 flex flex-col gap-3 text-center text-sm 
                 text-light-secondary dark:text-dark-secondary'
    >
      <nav className='flex flex-wrap justify-center gap-2'>
        {footerLinks.map(([linkName, href]) => (
          <a
            className='custom-underline'
            target='_blank'
            rel='noreferrer'
            href={href}
            key={href}
          >
            {linkName}
          </a>
        ))}
      </nav>
      <p>© {new Date().getFullYear()} d1loop.</p>
    </footer>
  );
}
