import Image from 'next/image';
import Link from 'next/link';

const links = [
  { href: '/chat', label: 'Chat' },
  { href: '/quiz', label: 'Quiz' },
  { href: '/summarize', label: 'Summarize' },
  { href: '/study-plan', label: 'Study Plan' },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200/90 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-3 text-base font-semibold tracking-tight text-neutral-900">
          <div className="inline-flex h-8 w-8 items-center justify-center rounded-full overflow-hidden bg-[#2f93d1] text-sm font-semibold text-white">
            <Image src="/logo.jpeg" alt="Plaksha logo" width={32} height={32} className="h-8 w-8 object-cover" priority />
          </div>
          <span>Chatraplaksh</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary navigation">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-neutral-600 transition-colors hover:text-neutral-900">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden text-xs uppercase tracking-[0.2em] text-[#7bb7df] md:block">Plaksha</div>
      </div>
    </header>
  );
}
