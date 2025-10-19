import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="group">
            <div className="relative w-40 h-10">
              <Image
                src="/images/crobot.svg"
                alt="CROBOT Logo"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>
          
          <nav className="flex items-center space-x-1">
            <Link
              href="/dashboard"
              className="px-4 py-2 text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] rounded-lg hover:bg-white/60 smooth-transition"
            >
              Dashboard
            </Link>
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] rounded-lg hover:bg-white/60 smooth-transition"
            >
              Home
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
