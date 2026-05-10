import Link from 'next/link';

const links = [
  { href: '/chat', label: 'Chat' },
  { href: '/quiz', label: 'Quiz' },
  { href: '/summarize', label: 'Summarize' },
  { href: '/study-plan', label: 'Study Plan' },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200/80 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-base font-semibold tracking-tight text-neutral-900">
          Student Study Companion
        </Link>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary navigation">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-neutral-600 transition-colors hover:text-neutral-900">
              {link.label}
            </Link>
          ))}
        </nav>
        <Link href="/chat" className="hidden rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50 md:inline-flex">
          Open app
        </Link>
      </div>
    </header>
  );
}
