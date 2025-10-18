import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <main className="max-w-4xl w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white">
            CRO Recruiter
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300">
            Clinical Trial Patient Recruitment & Management
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Streamline your clinical trial recruitment process with AI-powered eligibility screening,
            automated patient outreach, and comprehensive patient management tools.
          </p>

          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="space-y-2">
              <div className="text-3xl">🎯</div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Smart Screening</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                AI-powered eligibility scoring based on inclusion and exclusion criteria
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl">📞</div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Automated Outreach</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Intelligent calling system to contact and pre-screen potential participants
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl">📊</div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Patient Management</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Comprehensive dashboard to track, filter, and manage patient recruitment
              </p>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-lg px-8 py-4 rounded-lg transition-colors shadow-lg hover:shadow-xl"
          >
            Go to Dashboard
          </Link>
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          Built for research coordinators and call center agents
        </div>
      </main>
    </div>
  );
}
