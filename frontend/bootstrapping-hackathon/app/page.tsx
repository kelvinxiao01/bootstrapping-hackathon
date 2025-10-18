import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-blue-50/30 to-[#F9FAFB] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(14,165,233,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.06),transparent_50%)]" />
      
      <main className="relative max-w-6xl mx-auto px-6 py-32 flex flex-col items-center text-center space-y-16 fade-in">
        <div className="space-y-6 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-[var(--border)] text-sm text-[var(--muted)] scale-in">
            <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
            <span>Powered by AI</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-[var(--foreground)] tracking-tight leading-tight">
            CRO Recruiter
          </h1>
          
          <p className="text-xl md:text-2xl text-[var(--muted)] font-light leading-relaxed">
            Streamline clinical trial recruitment with intelligent eligibility screening
            and automated patient outreach
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 w-full max-w-4xl">
          <div className="group p-8 rounded-2xl bg-white/50 backdrop-blur-sm border border-[var(--border)] hover-lift smooth-transition">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--accent)] to-blue-600 flex items-center justify-center mb-4 smooth-transition group-hover:scale-110">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
              Smart Screening
            </h3>
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              AI-powered eligibility scoring based on inclusion and exclusion criteria
            </p>
          </div>

          <div className="group p-8 rounded-2xl bg-white/50 backdrop-blur-sm border border-[var(--border)] hover-lift smooth-transition">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--success)] to-emerald-600 flex items-center justify-center mb-4 smooth-transition group-hover:scale-110">
              <span className="text-2xl">📞</span>
            </div>
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
              Automated Calls
            </h3>
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              Intelligent calling system to contact and pre-screen potential participants
            </p>
          </div>

          <div className="group p-8 rounded-2xl bg-white/50 backdrop-blur-sm border border-[var(--border)] hover-lift smooth-transition">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--warning)] to-orange-600 flex items-center justify-center mb-4 smooth-transition group-hover:scale-110">
              <span className="text-2xl">📊</span>
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
          className="group inline-flex items-center space-x-2 px-8 py-4 bg-[var(--foreground)] text-white rounded-xl font-medium shadow-lg shadow-gray-900/10 hover-lift smooth-transition"
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
