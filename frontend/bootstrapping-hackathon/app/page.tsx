import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F9FAFB] to-[#EEF1F6]">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent)] to-blue-700 flex items-center justify-center">
                <span className="text-white text-sm font-semibold">CR</span>
              </div>
              <span className="text-lg font-semibold text-[var(--foreground)] tracking-tight">
                CRO Recruiter
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="relative">
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold text-[var(--foreground)] tracking-tight leading-tight">
              Accelerate Clinical Trial Recruitment with Precision
            </h1>
            
            <p className="text-xl md:text-2xl text-[var(--muted)] font-light leading-relaxed max-w-3xl mx-auto">
              CRO Recruiter streamlines patient outreach, eligibility screening, and data management for research teams
            </p>

            <Link
              href="/dashboard"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-[var(--accent)] text-white rounded-xl font-medium shadow-lg shadow-blue-500/20 hover-lift smooth-transition"
            >
              <span>Enter Dashboard</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>

        <section className="py-20 px-6 bg-white">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)]">
              Complete Visibility from Call to Enrollment
            </h2>
            <p className="text-lg text-[var(--muted)] leading-relaxed max-w-2xl mx-auto">
              CRO Recruiter connects patient call data to a centralized dashboard where coordinators can evaluate eligibility criteria, track recruitment progress, and make informed matching decisions. Every interaction is captured, scored, and presented in an intuitive interface designed for clinical research teams.
            </p>
          </div>
        </section>

        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] text-center mb-16">
              Key Features
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="p-6 rounded-xl bg-white border border-[var(--border)] smooth-transition hover-lift">
                <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-blue-50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2 text-center">
                  AI-Assisted Patient Screening
                </h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed text-center">
                  Automatically score patient eligibility based on inclusion and exclusion criteria
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white border border-[var(--border)] smooth-transition hover-lift">
                <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-blue-50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2 text-center">
                  Centralized Trial Dashboard
                </h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed text-center">
                  Manage all patient data, screening results, and recruitment metrics in one place
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white border border-[var(--border)] smooth-transition hover-lift">
                <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-blue-50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2 text-center">
                  Real-Time Call Integration
                </h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed text-center">
                  Connect patient calls directly to the platform for immediate eligibility assessment
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white border border-[var(--border)] smooth-transition hover-lift">
                <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-blue-50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2 text-center">
                  Secure & Compliant Data Management
                </h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed text-center">
                  HIPAA-compliant infrastructure to protect sensitive patient information
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] text-center mb-16">
              How It Works
            </h2>
            
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[var(--accent)] to-blue-700 flex items-center justify-center text-white text-2xl font-bold">
                  1
                </div>
                <h3 className="text-lg font-semibold text-[var(--foreground)]">
                  Collect Patient Data
                </h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">
                  Import patient information through calls, forms, or CSV upload
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[var(--accent)] to-blue-700 flex items-center justify-center text-white text-2xl font-bold">
                  2
                </div>
                <h3 className="text-lg font-semibold text-[var(--foreground)]">
                  AI Screens Eligibility
                </h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">
                  Automated scoring evaluates patients against trial criteria
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[var(--accent)] to-blue-700 flex items-center justify-center text-white text-2xl font-bold">
                  3
                </div>
                <h3 className="text-lg font-semibold text-[var(--foreground)]">
                  Coordinator Review
                </h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">
                  Research teams verify results and add clinical notes
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[var(--accent)] to-blue-700 flex items-center justify-center text-white text-2xl font-bold">
                  4
                </div>
                <h3 className="text-lg font-semibold text-[var(--foreground)]">
                  Match to Study
                </h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">
                  Eligible patients are enrolled and tracked through the trial
                </p>
              </div>
            </div>
          </div>
        </section>

        <footer className="py-12 px-6 bg-[var(--foreground)] text-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">CR</span>
                  </div>
                  <span className="text-lg font-semibold">CRO Recruiter</span>
                </div>
                <p className="text-sm text-white/70 leading-relaxed">
                  Streamlining clinical trial recruitment for research coordinators and CROs worldwide.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Company</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-sm text-white/70 hover:text-white smooth-transition">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-white/70 hover:text-white smooth-transition">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-white/70 hover:text-white smooth-transition">
                      Terms of Service
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Contact</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="mailto:support@crorecruiter.com" className="text-sm text-white/70 hover:text-white smooth-transition">
                      support@crorecruiter.com
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-white/70 hover:text-white smooth-transition">
                      Schedule a Demo
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10 text-center">
              <p className="text-sm text-white/50">
                © 2025 CRO Recruiter. Built for research coordinators and clinical trial teams.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
