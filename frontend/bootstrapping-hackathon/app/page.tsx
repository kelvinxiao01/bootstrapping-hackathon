'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [currentSubheadline, setCurrentSubheadline] = useState(0);
  
  const subheadlines = [
    'AI-powered patient calls',
    'Seamless eligibility screening',
    'Automated follow-ups'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSubheadline((prev) => (prev + 1) % subheadlines.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Aurora Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
        <div className="absolute inset-0 aurora-gradient"></div>
      </div>

      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-lg border-b border-slate-200/50">
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
            <nav className="flex items-center space-x-8">
              <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                Dashboard
              </Link>
              <Link href="/" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                Home
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10">
        <section className="pt-40 pb-32 px-6">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            {/* Main Headline */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-semibold text-slate-900 tracking-tight leading-tight">
                Empower Your&nbsp;
                <span className="relative inline-block align-baseline">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-extrabold italic">
                    Research Team
                  </span>
                  {/* gradient underline */}
                  <span
                    aria-hidden
                    className="absolute left-0 right-0 -bottom-2 h-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600"
                  />
                </span>
                &nbsp;:
              </h1>
              
              {/* Animated Rotating Subheadline */}
              <div className="h-40 flex items-center justify-center overflow-visible py-4">
                {subheadlines.map((text, index) => (
                  <h2
                    key={index}
                    className={`absolute text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-1000 drop-shadow-lg leading-relaxed ${
                      currentSubheadline === index
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-4'
                    }`}
                  >
                    {text}
                  </h2>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex flex-col items-center space-y-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center space-x-2 px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 transition-all duration-200"
              >
                <span>Enter Dashboard</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <p className="text-sm text-slate-500 font-light">
                Streamline patient recruitment and trial management
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6 bg-white/60 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
              Complete Visibility from Call to Enrollment
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-light">
              CROBOT connects patient call data to a centralized dashboard where coordinators can evaluate eligibility criteria, track recruitment progress, and make informed matching decisions. Every interaction is captured, scored, and presented in an intuitive interface designed for clinical research teams.
            </p>
          </div>
        </section>

        {/* Key Features Grid */}
        <section className="py-20 px-6 relative">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 text-center mb-16">
              Key Features
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="p-6 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/50 hover:shadow-lg hover:border-blue-300/50 transition-all duration-200">
                <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-blue-50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2 text-center">
                  AI-Assisted Patient Screening
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed text-center font-light">
                  Automatically score patient eligibility based on inclusion and exclusion criteria
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/50 hover:shadow-lg hover:border-blue-300/50 transition-all duration-200">
                <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-blue-50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2 text-center">
                  Centralized Trial Dashboard
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed text-center font-light">
                  Manage all patient data, screening results, and recruitment metrics in one place
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/50 hover:shadow-lg hover:border-blue-300/50 transition-all duration-200">
                <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-blue-50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2 text-center">
                  Real-Time Call Integration
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed text-center font-light">
                  Connect patient calls directly to the platform for immediate eligibility assessment
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/50 hover:shadow-lg hover:border-blue-300/50 transition-all duration-200">
                <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-blue-50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2 text-center">
                  Secure & Compliant Data Management
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed text-center font-light">
                  HIPAA-compliant infrastructure to protect sensitive patient information
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 px-6 bg-white/60 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 text-center mb-16">
              How It Works
            </h2>
            
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  1
                </div>
                <h3 className="text-lg font-semibold text-slate-800">
                  Collect Patient Data
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-light">
                  Import patient information through calls, forms, or CSV upload
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  2
                </div>
                <h3 className="text-lg font-semibold text-slate-800">
                  AI Screens Eligibility
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-light">
                  Automated scoring evaluates patients against trial criteria
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  3
                </div>
                <h3 className="text-lg font-semibold text-slate-800">
                  Coordinator Review
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-light">
                  Research teams verify results and add clinical notes
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  4
                </div>
                <h3 className="text-lg font-semibold text-slate-800">
                  Match to Study
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-light">
                  Eligible patients are enrolled and tracked through the trial
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 bg-slate-900 text-white relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">About CROBOT</h3>
                <p className="text-sm text-slate-400 leading-relaxed font-light">
                  Streamlining clinical trial recruitment for research coordinators and CROs worldwide.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Company</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors font-light">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors font-light">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors font-light">
                      Terms of Service
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Contact</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="mailto:support@crorecruiter.com" className="text-sm text-slate-400 hover:text-white transition-colors font-light">
                      support@crorecruiter.com
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors font-light">
                      Schedule a Demo
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-800 text-center">
              <p className="text-sm text-slate-500 font-light">
                &copy; 2025 CROBOT. Built for research coordinators and clinical trial teams.
              </p>
            </div>
          </div>
        </footer>
      </main>

      <style jsx>{`
        @keyframes aurora {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .aurora-gradient {
          background: linear-gradient(
            120deg,
            rgba(59, 130, 246, 0.05),
            rgba(99, 102, 241, 0.08),
            rgba(139, 92, 246, 0.05),
            rgba(59, 130, 246, 0.05)
          );
          background-size: 300% 300%;
          animation: aurora 15s ease infinite;
        }
      `}</style>
    </div>
  );
}
