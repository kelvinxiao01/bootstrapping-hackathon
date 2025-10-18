import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🏥</span>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              CRO Recruiter
            </span>
          </Link>
          
          <nav className="flex items-center space-x-6">
            <Link
              href="/dashboard"
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium"
            >
              Dashboard
            </Link>
            <span className="text-gray-400">|</span>
            <Link
              href="/"
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium"
            >
              Home
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
