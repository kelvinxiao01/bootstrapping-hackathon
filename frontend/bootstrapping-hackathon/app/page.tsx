import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F9FAFB] to-[#EEF1F6] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(37,99,235,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(37,99,235,0.03),transparent_50%)]" />
      
      <main className="relative max-w-6xl mx-auto px-6 py-32 flex flex-col items-center text-center space-y-16 fade-in">
        <div className="space-y-6 max-w-3xl">
          <h1 className="text-6xl md:text-7xl font-bold text-[var(--foreground)] tracking-tight leading-tight">
            CRO Recruiter
          </h1>
          
          <p className="text-xl md:text-2xl text-[var(--muted)] font-light leading-relaxed">
            Streamline clinical trial recruitment with intelligent eligibility screening
            and automated patient outreach
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 w-full max-w-4xl">
          <div className="group p-8 rounded-xl bg-white/60 backdrop-blur-sm border border-[var(--border)] hover-lift smooth-transition">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--accent)] to-blue-700 flex items-center justify-center mb-4 smooth-transition group-hover:scale-105">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
              Smart Screening
            </h3>
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              AI-powered eligibility scoring based on inclusion and exclusion criteria
            </p>
          </div>

          <div className="group p-8 rounded-xl bg-white/60 backdrop-blur-sm border border-[var(--border)] hover-lift smooth-transition">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--success)] to-green-700 flex items-center justify-center mb-4 smooth-transition group-hover:scale-105">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
              Automated Calls
            </h3>
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              Intelligent calling system to contact and pre-screen potential participants
            </p>
          </div>

          <div className="group p-8 rounded-xl bg-white/60 backdrop-blur-sm border border-[var(--border)] hover-lift smooth-transition">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--warning)] to-orange-700 flex items-center justify-center mb-4 smooth-transition group-hover:scale-105">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
              Patient Insights
            </h3>
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              Comprehensive dashboard to track, filter, and manage recruitment
            </p>
          </div>
        </div>

        <Link
          href="/dashboard"
          className="group inline-flex items-center space-x-2 px-8 py-4 bg-[var(--accent)] text-white rounded-xl font-medium shadow-lg shadow-blue-500/20 hover-lift smooth-transition"
        >
          <span>Open Dashboard</span>
          <svg className="w-4 h-4 smooth-transition group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>

        <p className="text-sm text-[var(--muted)] pt-8">
          Built for research coordinators and clinical trial teams
        </p>
      </main>
    </div>
  );
}
