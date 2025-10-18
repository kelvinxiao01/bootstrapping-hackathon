import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent)] to-blue-600 flex items-center justify-center smooth-transition group-hover:scale-105">
              <span className="text-white text-sm font-semibold">CR</span>
            </div>
            <span className="text-lg font-semibold text-[var(--foreground)] tracking-tight">
              CRO Recruiter
            </span>
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
